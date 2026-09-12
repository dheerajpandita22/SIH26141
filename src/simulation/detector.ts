// ============================================================
// Threat Detector Module — Chi-square test + verdict logic
// ============================================================

import type {
  DetectorResult,
  MeasurementCounts,
  BasisProbabilities,
  SingleBasisResult,
  MultiBasisDetectorResult,
} from '../types/simulation';
import { chiSquareStatistic, chiSquarePValue, calculateMismatchRate } from './statistics';

/**
 * Run threat detection on a single basis measurement.
 * 
 * LEGITIMATE if: pValue >= alpha AND mismatchRate <= mismatchThreshold
 * FLAGGED otherwise.
 */
export function detectThreat(
  observed: MeasurementCounts,
  expected: BasisProbabilities,
  shots: number,
  alpha: number = 0.05,
  mismatchThreshold: number = 0.15
): DetectorResult {
  const chiSq = chiSquareStatistic(observed, expected, shots);
  const pValue = chiSquarePValue(chiSq, 1);

  const observedProb: BasisProbabilities = {
    p0: observed.count0 / shots,
    p1: observed.count1 / shots,
  };

  const mismatchRate = calculateMismatchRate(observedProb, expected);

  const pValueFlagged = pValue < alpha;
  const mismatchFlagged = mismatchRate > mismatchThreshold;

  let reason = '';
  if (pValueFlagged && mismatchFlagged) {
    reason = 'Statistically inconsistent with expected signature AND mismatch rate exceeded threshold';
  } else if (pValueFlagged) {
    reason = 'Statistically inconsistent with expected signature';
  } else if (mismatchFlagged) {
    reason = 'Mismatch rate exceeded threshold';
  } else {
    reason = 'All checks passed';
  }

  return {
    chiSquare: chiSq,
    pValue,
    mismatchRate,
    verdict: pValueFlagged || mismatchFlagged ? 'FLAGGED' : 'LEGITIMATE',
    reason,
    alpha,
    mismatchThreshold,
  };
}

/**
 * Run multi-basis detection. FLAGGED if any single basis is flagged.
 */
export function detectMultiBasis(
  basisResults: SingleBasisResult[],
  _alpha?: number,
  _mismatchThreshold?: number
): MultiBasisDetectorResult {
  const result: MultiBasisDetectorResult = {
    overallVerdict: 'LEGITIMATE',
    overallReason: 'All bases passed verification',
  };

  const reasons: string[] = [];

  for (const br of basisResults) {
    const basis = br.basis as 'Z' | 'X' | 'Y';
    result[basis] = br.detector;

    if (br.detector.verdict === 'FLAGGED') {
      result.overallVerdict = 'FLAGGED';
      reasons.push(`${basis}-basis: ${br.detector.reason}`);
    }
  }

  if (reasons.length > 0) {
    result.overallReason = reasons.join('; ');
  }

  return result;
}
