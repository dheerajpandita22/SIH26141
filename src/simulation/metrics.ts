// ============================================================
// Batch Evaluation Metrics
// ============================================================

import type {
  AttackType,
  Verdict,
  ConfusionMatrix,
  BatchMetrics,
  AttackDetectionRate,
} from '../types/simulation';

const ATTACK_LABELS: Record<AttackType, string> = {
  none: 'No Attack',
  forgery: 'Forgery',
  impersonation: 'Impersonation',
  replay: 'Replay',
  channel: 'Channel Manipulation',
};

/**
 * Calculate confusion matrix from simulation results.
 * 
 * - No Attack + LEGITIMATE → TN
 * - No Attack + FLAGGED → FP
 * - Any attack + FLAGGED → TP
 * - Any attack + LEGITIMATE → FN
 */
export function calculateConfusionMatrix(
  results: Array<{ attack: AttackType; verdict: Verdict }>
): ConfusionMatrix {
  let tp = 0, tn = 0, fp = 0, fn = 0;

  for (const res of results) {
    const isAttack = res.attack !== 'none';
    if (isAttack) {
      if (res.verdict === 'FLAGGED') tp++;
      else fn++;
    } else {
      if (res.verdict === 'LEGITIMATE') tn++;
      else fp++;
    }
  }

  return { tp, tn, fp, fn };
}

/**
 * Calculate accuracy, precision, recall, F1 from confusion matrix.
 */
export function calculateMetrics(confusion: ConfusionMatrix): BatchMetrics {
  const { tp, tn, fp, fn } = confusion;
  const total = tp + tn + fp + fn;

  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return { accuracy, precision, recall, f1, confusion };
}

/**
 * Calculate per-attack-type detection rates.
 */
export function calculateDetectionRates(
  results: Array<{ attack: AttackType; verdict: Verdict }>
): AttackDetectionRate[] {
  const counts = new Map<AttackType, { flagged: number; total: number }>();

  for (const res of results) {
    if (!counts.has(res.attack)) {
      counts.set(res.attack, { flagged: 0, total: 0 });
    }
    const state = counts.get(res.attack)!;
    state.total++;
    if (res.verdict === 'FLAGGED') {
      state.flagged++;
    }
  }

  const rates: AttackDetectionRate[] = [];
  counts.forEach((val, key) => {
    rates.push({
      attackType: key,
      label: ATTACK_LABELS[key] || key,
      totalTrials: val.total,
      flaggedCount: val.flagged,
      flaggedRate: val.total > 0 ? val.flagged / val.total : 0,
    });
  });

  return rates;
}
