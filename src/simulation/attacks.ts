// ============================================================
// Attack Simulation Module
// ============================================================

import type { SimulationConfig, AttackInfo, BasisProbabilities } from '../types/simulation';
import type { RNG } from '../utils/random';

/**
 * Apply the selected attack to get the effective theta and attack info.
 * 
 * - none: original theta
 * - forgery: random attacker theta
 * - impersonation: H|0⟩ = |+⟩ (theta = π/2)
 * - replay: original theta (detection via session/nonce only)
 * - channel: original theta, but may flip measurement probabilities
 */
export function applyAttack(
  config: SimulationConfig,
  rng: RNG
): { effectiveTheta: number; attackInfo: AttackInfo; channelDisturbed: boolean } {
  let effectiveTheta = config.theta;
  let channelDisturbed = false;

  const attackInfo: AttackInfo = {
    type: config.attack,
    description: '',
  };

  switch (config.attack) {
    case 'none':
      attackInfo.description = 'No attack — legitimate signature transmission';
      break;

    case 'forgery': {
      const attackerTheta = rng() * 2 * Math.PI;
      effectiveTheta = attackerTheta;
      attackInfo.attackerTheta = attackerTheta;
      attackInfo.angleDifference = Math.abs(attackerTheta - config.theta);
      attackInfo.description = `Forgery — attacker used θ=${attackerTheta.toFixed(3)} rad (${(attackerTheta * 180 / Math.PI).toFixed(1)}°)`;
      break;
    }

    case 'impersonation':
      effectiveTheta = Math.PI / 2; // H|0⟩ = |+⟩
      attackInfo.description = 'Impersonation — attacker sending generic |+⟩ state (H|0⟩)';
      break;

    case 'replay':
      // Replay uses original theta — detection is via session/nonce check
      attackInfo.nonceValid = false;
      attackInfo.description = 'Replay — reusing previous session data. Detection requires nonce validation.';
      break;

    case 'channel': {
      const flipProb = config.flipProbability;
      attackInfo.flipProbability = flipProb;
      if (rng() < flipProb) {
        channelDisturbed = true;
      }
      attackInfo.channelDisturbed = channelDisturbed;
      attackInfo.description = channelDisturbed
        ? `Channel manipulation — bit flip occurred (probability: ${(flipProb * 100).toFixed(0)}%)`
        : `Channel manipulation — no disturbance this time (probability: ${(flipProb * 100).toFixed(0)}%)`;
      break;
    }
  }

  return { effectiveTheta, attackInfo, channelDisturbed };
}

/**
 * Apply channel effect to measurement probabilities.
 * If disturbed, swaps p0 and p1 (simulates bit-flip / X gate).
 */
export function applyChannelEffect(
  probabilities: BasisProbabilities,
  disturbed: boolean
): BasisProbabilities {
  if (disturbed) {
    return { p0: probabilities.p1, p1: probabilities.p0 };
  }
  return probabilities;
}
