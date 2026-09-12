import { useState, useCallback, useRef } from 'react';
import { BatchResult, SimulationConfig, AttackType, Verdict, BatchMetrics, AttackDetectionRate } from '../types/simulation';
import { runFullSimulation } from '../simulation/runSimulation';
import { createRNG } from '../utils/random';

function getAttackLabel(type: AttackType): string {
    switch (type) {
        case 'none': return 'No Attack (Legitimate)';
        case 'forgery': return 'Forgery Attack';
        case 'impersonation': return 'Impersonation Attack';
        case 'replay': return 'Replay Attack';
        case 'channel': return 'Channel Manipulation';
        default: return type;
    }
}

export function useBatchEval() {
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const isCancelled = useRef<boolean>(false);

  const runBatch = useCallback(async (config: SimulationConfig, trialsPerCondition: number) => {
    setIsRunning(true);
    setProgress(0);
    setBatchResult(null);
    isCancelled.current = false;

    const attackTypes: AttackType[] = ['none', 'forgery', 'impersonation', 'replay', 'channel'];
    const allResults: Array<{attack: AttackType, verdict: Verdict, expectedVerdict: Verdict}> = [];
    const usedNonces = new Set<string>();
    
    let completed = 0;
    const totalTrials = attackTypes.length * trialsPerCondition;
    const CHUNK_SIZE = 10;
    const rng = createRNG(config.seed);

    for (const attack of attackTypes) {
      for (let i = 0; i < trialsPerCondition; i += CHUNK_SIZE) {
        if (isCancelled.current) {
          setIsRunning(false);
          return;
        }

        const chunkEnd = Math.min(i + CHUNK_SIZE, trialsPerCondition);
        
        await new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            for (let j = i; j < chunkEnd; j++) {
              const trialConfig = { ...config, attack };
              const simResult = runFullSimulation(trialConfig, usedNonces, rng);
              
              allResults.push({
                attack,
                verdict: simResult.verdict,
                expectedVerdict: attack === 'none' ? 'LEGITIMATE' : 'FLAGGED'
              });
              completed++;
            }
            setProgress(Math.round((completed / totalTrials) * 100));
            resolve();
          });
        });
      }
    }

    // Calculate metrics
    let tp = 0, tn = 0, fp = 0, fn = 0;
    const counts = new Map<AttackType, { flagged: number, total: number }>();
    
    for (const res of allResults) {
        const isAttack = res.attack !== 'none';
        if (isAttack) {
            if (res.verdict === 'FLAGGED') tp++;
            else fn++;
        } else {
            if (res.verdict === 'LEGITIMATE') tn++;
            else fp++;
        }
        
        if (!counts.has(res.attack)) {
            counts.set(res.attack, { flagged: 0, total: 0 });
        }
        const state = counts.get(res.attack)!;
        state.total++;
        if (res.verdict === 'FLAGGED') {
            state.flagged++;
        }
    }

    const total = tp + tn + fp + fn;
    const accuracy = total > 0 ? (tp + tn) / total : 0;
    const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
    const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
    const f1 = (precision + recall) > 0 ? 2 * precision * recall / (precision + recall) : 0;

    const detectionRates: AttackDetectionRate[] = [];
    counts.forEach((val, key) => {
        detectionRates.push({
            attackType: key,
            label: getAttackLabel(key),
            totalTrials: val.total,
            flaggedCount: val.flagged,
            flaggedRate: val.total > 0 ? val.flagged / val.total : 0
        });
    });

    const metrics: BatchMetrics = {
        accuracy,
        precision,
        recall,
        f1,
        confusion: { tp, tn, fp, fn }
    };

    setBatchResult({
        trialsPerCondition,
        metrics,
        detectionRates,
        allResults,
        timestamp: Date.now()
    });
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    isCancelled.current = true;
    setBatchResult(null);
    setProgress(0);
    setIsRunning(false);
  }, []);

  return { batchResult, isRunning, progress, runBatch, reset };
}
