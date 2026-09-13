// ============================================================
// Main Simulation Orchestrator — ties all modules together
// ============================================================

import type {
  SimulationConfig,
  SimulationResult,
  SingleBasisResult,
  BasisProbabilities,
  MeasurementBasis,
} from '../types/simulation';
import { createRNG } from '../utils/random';
import type { RNG } from '../utils/random';
import { applyAttack, applyChannelEffect } from './attacks';
import { prepareSignatureState, getTheoreticalProbabilities } from './quantumState';
import { sampleMeasurements } from './statistics';
import { detectThreat, detectMultiBasis } from './detector';
import { generateSession, generateReplaySession, validateSession } from './session';

/**
 * Run a complete simulation with the given configuration.
 * 
 * Flow:
 * 1. Create PRNG from seed
 * 2. Apply attack → get effectiveTheta
 * 3. For each measurement basis:
 *    a. Get EXPECTED probabilities from original theta
 *    b. Get MEASUREMENT probabilities from effectiveTheta (what's actually measured)
 *    c. Apply channel effect if applicable
 *    d. Sample measurements from measurement probabilities
 *    e. Run detector comparing observed vs expected
 * 4. Handle session/nonce for replay detection
 * 5. Determine overall verdict
 */
export function runFullSimulation(
  config: SimulationConfig,
  usedNonces: Set<string>,
  sharedRng?: RNG
): SimulationResult {
  const rng = sharedRng ?? createRNG(config.seed);

  // 1. Prepare the signature state
  const signatureState = prepareSignatureState(config.theta);

  // 2. Apply attack
  const { effectiveTheta, attackInfo, channelDisturbed } = applyAttack(config, rng);

  // 3. Determine which bases to measure
  const bases: Array<Exclude<MeasurementBasis, 'ALL'>> =
    config.basis === 'ALL' ? ['Z', 'X', 'Y'] : [config.basis];

  // 4. Measure each basis
  const basisResults: SingleBasisResult[] = [];

  for (const basis of bases) {
    // Expected probabilities from the ORIGINAL theta (what verifier expects)
    const expected = getTheoreticalProbabilities(config.theta, basis);

    // Measurement probabilities from the EFFECTIVE theta (what's actually measured)
    let measurementProbs = getTheoreticalProbabilities(effectiveTheta, basis);

    // Apply channel disturbance (bit-flip) if applicable
    measurementProbs = applyChannelEffect(measurementProbs, channelDisturbed);

    // Sample from the effective (possibly attacked) probabilities
    const counts = sampleMeasurements(measurementProbs.p0, config.shots, rng);

    // Observed probabilities
    const observed: BasisProbabilities = {
      p0: counts.count0 / config.shots,
      p1: counts.count1 / config.shots,
    };

    // Run detector: compare observed vs expected (original theta)
    const detector = detectThreat(
      counts,
      expected,
      config.shots,
      config.alpha,
      config.mismatchThreshold
    );

    basisResults.push({
      basis,
      expected,
      observed,
      counts,
      detector,
    });
  }

  // 5. Handle session/nonce for replay detection
  let session = generateSession();
  if (config.attack === 'replay') {
    // Simulate replay: create a previous session, add its nonce, then reuse it
    const prevSession = generateSession();
    usedNonces.add(prevSession.nonce);
    session = generateReplaySession(prevSession);
  }

  const sessionValidation = validateSession(session, usedNonces);
  usedNonces.add(session.nonce);

  // 6. Determine overall verdict
  const multiBasisResult = detectMultiBasis(basisResults, config.alpha, config.mismatchThreshold);

  let verdict = multiBasisResult.overallVerdict;
  let reason = multiBasisResult.overallReason;

  // For replay: even if chi-square passes, fail on session validation
  if (!sessionValidation.isValid) {
    verdict = 'FLAGGED';
    reason = sessionValidation.reason;
  }

  return {
    id: `sim_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    timestamp: Date.now(),
    config: { ...config },
    signatureState,
    attackInfo,
    basisResults,
    verdict,
    reason,
    sessionValidation,
  };
}
