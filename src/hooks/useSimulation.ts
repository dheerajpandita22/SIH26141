import { useState, useCallback, useEffect } from 'react';
import {
  Basis,
  AttackType,
  SimulationRun,
  MeasurementResult,
  ThreatDetectorResult,
} from '../types/simulation';
import { calculateQuantumState, normalizeAngle } from '../simulation/quantumState';
import { QuantumTeleportation } from '../simulation/teleportation';
import { AttackSimulator } from '../simulation/attacks';
import { ThreatDetector } from '../simulation/detector';
import { chiSquareTest } from '../simulation/statistics';

interface UseSimulationState {
  theta: number;
  basis: Basis;
  shots: number;
  attackType: AttackType;
  channelDisturbanceProb: number;
  randomSeed?: number;
  isRunning: boolean;
  lastResults: MeasurementResult[];
  threatDetectorResult?: ThreatDetectorResult;
  simulationHistory: SimulationRun[];
}

export function useSimulation() {
  const [state, setState] = useState<UseSimulationState>({
    theta: Math.PI / 3,
    basis: 'Z',
    shots: 2000,
    attackType: 'none',
    channelDisturbanceProb: 30,
    isRunning: false,
    lastResults: [],
    simulationHistory: [],
  });

  const teleportation = new QuantumTeleportation();
  const attackSimulator = new AttackSimulator();
  const threatDetector = new ThreatDetector();

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simulationHistory');
    if (saved) {
      try {
        setState((prev) => ({
          ...prev,
          simulationHistory: JSON.parse(saved),
        }));
      } catch (e) {
        console.error('Failed to load history', e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(
      'simulationHistory',
      JSON.stringify(state.simulationHistory)
    );
  }, [state.simulationHistory]);

  const setTheta = useCallback((theta: number) => {
    setState((prev) => ({
      ...prev,
      theta: normalizeAngle(theta),
    }));
  }, []);

  const setBasis = useCallback((basis: Basis) => {
    setState((prev) => ({
      ...prev,
      basis,
    }));
  }, []);

  const setShots = useCallback((shots: number) => {
    setState((prev) => ({
      ...prev,
      shots: Math.max(100, Math.min(100000, shots)),
    }));
  }, []);

  const setAttackType = useCallback((attackType: AttackType) => {
    setState((prev) => ({
      ...prev,
      attackType,
    }));
  }, []);

  const setChannelDisturbanceProb = useCallback((prob: number) => {
    setState((prev) => ({
      ...prev,
      channelDisturbanceProb: Math.max(0, Math.min(100, prob)),
    }));
  }, []);

  const setRandomSeed = useCallback((seed?: number) => {
    setState((prev) => ({
      ...prev,
      randomSeed: seed,
    }));
  }, []);

  const runSimulation = useCallback(async () => {
    setState((prev) => ({ ...prev, isRunning: true }));

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Initialize session
      attackSimulator.initializeSession();

      // Get attack injection
      let effectiveTheta = state.theta;
      const attack = attackSimulator.simulateAttack(
        state.attackType,
        effectiveTheta,
        state.channelDisturbanceProb
      );

      // Apply attack if needed
      effectiveTheta = attackSimulator.applyAttackToTheta(
        effectiveTheta,
        attack
      );

      // Run teleportation and measurement
      let measurements = teleportation.executeTeleportation(
        effectiveTheta,
        state.basis,
        state.shots,
        state.randomSeed
      );

      // Apply channel disturbance
      if (attack.channelDisturbanceOccurred) {
        measurements = teleportation.simulateChannelDisturbance(
          measurements,
          true
        );
      }

      // Calculate chi-square for each measurement
      measurements = measurements.map((m) => {
        const { chiSquare, pValue } = chiSquareTest(
          m.observed0,
          m.observed1,
          m.expected0,
          m.expected1,
          m.shots
        );
        return { ...m, chiSquare, pValue };
      });

      // Detect threat
      const detectorResult = threatDetector.detectThreat(measurements);
      const verdict = detectorResult.verdict;

      // Update measurements with verdict
      measurements = measurements.map((m) => ({
        ...m,
        verdict: verdict as any,
      }));

      // Add to history
      const run: SimulationRun = {
        timestamp: Date.now(),
        theta: state.theta,
        basis: state.basis,
        shots: state.shots,
        attackType: state.attackType,
        pValue: detectorResult.pValue,
        mismatchRate: detectorResult.mismatchRate,
        verdict: verdict as any,
        measurements,
      };

      setState((prev) => ({
        ...prev,
        lastResults: measurements,
        threatDetectorResult: detectorResult,
        simulationHistory: [run, ...prev.simulationHistory.slice(0, 19)],
        isRunning: false,
      }));
    } catch (error) {
      console.error('Simulation error:', error);
      setState((prev) => ({ ...prev, isRunning: false }));
    }
  }, [state.theta, state.basis, state.shots, state.attackType, state.channelDisturbanceProb, state.randomSeed]);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      simulationHistory: [],
    }));
  }, []);

  const getQuantumState = useCallback(() => {
    return calculateQuantumState(state.theta, state.basis);
  }, [state.theta, state.basis]);

  return {
    ...state,
    setTheta,
    setBasis,
    setShots,
    setAttackType,
    setChannelDisturbanceProb,
    setRandomSeed,
    runSimulation,
    clearHistory,
    getQuantumState,
  };
}
