import { useState, useCallback, useRef } from 'react';
import { SimulationConfig, SimulationResult, SimulationStage, DEFAULT_CONFIG } from '../types/simulation';
import { runFullSimulation } from '../simulation/runSimulation';
import { createRNG } from '../utils/random';

const STAGES: SimulationStage[] = [
  'idle',
  'preparing',
  'bell-pair',
  'teleporting',
  'channel',
  'attacking',
  'measuring',
  'comparing',
  'detecting',
  'complete'
];

export function useSimulation() {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [stage, setStage] = useState<SimulationStage>('idle');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const usedNonces = useRef<Set<string>>(new Set());

  const updateConfig = useCallback((partial: Partial<SimulationConfig>) => {
    setConfig(prev => ({ ...prev, ...partial }));
  }, []);

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    setStage('idle');

    for (let i = 1; i < STAGES.length - 1; i++) {
      setStage(STAGES[i]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const rng = createRNG(config.seed);
    const simulationResult = runFullSimulation(config, usedNonces.current, rng);
    
    setResult(simulationResult);
    setStage('complete');
    setIsRunning(false);
  }, [config]);

  const reset = useCallback(() => {
    setResult(null);
    setStage('idle');
    setIsRunning(false);
  }, []);

  return { config, result, stage, isRunning, updateConfig, runSimulation, reset };
}
