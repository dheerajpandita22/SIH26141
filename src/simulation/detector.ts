import type {
  ThreatDetectorResult,
  MeasurementResult,
  BasisProbabilities,
  SingleBasisResult,
  Verdict,
} from '../types/simulation';
import { chiSquareTest } from './statistics';

/**
 * Threat Detection Engine
 * Uses chi-square test and mismatch rate to determine if signature is legitimate
 */
export class ThreatDetector {
  private alphaThreshold: number = 0.05; // Significance level
  private mismatchThreshold: number = 0.15; // 15% mismatch tolerance

  public setAlphaThreshold(alpha: number): void {
    this.alphaThreshold = Math.max(0, Math.min(1, alpha));
  }

  public setMismatchThreshold(threshold: number): void {
    this.mismatchThreshold = Math.max(0, Math.min(1, threshold));
  }

  public detectThreat(
    measurements: MeasurementResult[]
  ): ThreatDetectorResult {
    // If measuring all bases, require all to pass
    if (measurements.length > 1) {
      return this.detectMultiBasis(measurements);
    }

    const m = measurements[0];
    return this.evaluateMeasurement(m);
  }

  private evaluateMeasurement(
    measurement: MeasurementResult
  ): ThreatDetectorResult {
    const { statistic: chiSquare, pValue } = chiSquareTest(
      measurement.observed0,
      measurement.observed1,
      measurement.expected0,
      measurement.expected1,
      measurement.shots
    );

    const mismatchRate = measurement.mismatchRate;
    const verdict = this.getVerdict(pValue, mismatchRate);
    const reason = this.getReason(pValue, mismatchRate);

    return {
      chiSquare,
      pValue,
      mismatchRate,
      alphaThreshold: this.alphaThreshold,
      mismatchThreshold: this.mismatchThreshold,
      verdict,
      reason,
    };
  }

  private detectMultiBasis(
    measurements: MeasurementResult[]
  ): ThreatDetectorResult {
    let maxChiSquare = 0;
    let minPValue = 1;
    let maxMismatchRate = 0;

    for (const m of measurements) {
      const { statistic: chiSquare, pValue } = chiSquareTest(
        m.observed0,
        m.observed1,
        m.expected0,
        m.expected1,
        m.shots
      );

      maxChiSquare = Math.max(maxChiSquare, chiSquare);
      minPValue = Math.min(minPValue, pValue);
      maxMismatchRate = Math.max(maxMismatchRate, m.mismatchRate);
    }

    const verdict = this.getVerdict(minPValue, maxMismatchRate);
    const reason = this.getReasonMultiBasis(minPValue, maxMismatchRate);

    return {
      chiSquare: maxChiSquare,
      pValue: minPValue,
      mismatchRate: maxMismatchRate,
      alphaThreshold: this.alphaThreshold,
      mismatchThreshold: this.mismatchThreshold,
      verdict,
      reason,
    };
  }

  private getVerdict(pValue: number, mismatchRate: number): 'LEGITIMATE' | 'FLAGGED' {
    const pValueCheck = pValue >= this.alphaThreshold;
    const mismatchCheck = mismatchRate <= this.mismatchThreshold;

    return pValueCheck && mismatchCheck ? 'LEGITIMATE' : 'FLAGGED';
  }

  private getReason(pValue: number, mismatchRate: number): string {
    const pValueOk = pValue >= this.alphaThreshold;
    const mismatchOk = mismatchRate <= this.mismatchThreshold;

    if (pValueOk && mismatchOk) {
      return `Signature is statistically consistent (p=${pValue.toFixed(4)}, mismatch=${(mismatchRate * 100).toFixed(2)}%)`;
    }

    const reasons: string[] = [];
    if (!pValueOk) {
      reasons.push(
        `p-value (${pValue.toFixed(4)}) below threshold (${this.alphaThreshold})`
      );
    }
    if (!mismatchOk) {
      reasons.push(
        `mismatch rate (${(mismatchRate * 100).toFixed(2)}%) exceeds threshold (${(this.mismatchThreshold * 100).toFixed(1)}%)`
      );
    }

    return `FLAGGED — ${reasons.join('; ')}`;
  }

  private getReasonMultiBasis(
    pValue: number,
    mismatchRate: number
  ): string {
    const pValueOk = pValue >= this.alphaThreshold;
    const mismatchOk = mismatchRate <= this.mismatchThreshold;

    if (pValueOk && mismatchOk) {
      return `Multi-basis measurement: signature verified across all bases`;
    }

    const reasons: string[] = [];
    if (!pValueOk) {
      reasons.push(`one or more bases show statistical inconsistency`);
    }
    if (!mismatchOk) {
      reasons.push(`multi-basis mismatch exceeds threshold`);
    }

    return `FLAGGED — ${reasons.join('; ')}`;
  }
}

export const defaultDetector = new ThreatDetector();

/**
 * Pure, single-basis threat detection function used by the functional
 * simulation orchestrator (runSimulation.ts). Compares sampled counts
 * against theoretical expected probabilities via a chi-square test and
 * a raw mismatch-rate check.
 */
export function detectThreat(
  counts: { count0: number; count1: number },
  expected: BasisProbabilities,
  shots: number,
  alpha: number,
  mismatchThreshold: number
): ThreatDetectorResult {
  const { statistic, pValue } = chiSquareTest(
    counts.count0,
    counts.count1,
    expected.p0,
    expected.p1,
    shots
  );

  const observedP0 = shots > 0 ? counts.count0 / shots : 0;
  const mismatchRate = Math.abs(observedP0 - expected.p0);

  const pValueOk = pValue >= alpha;
  const mismatchOk = mismatchRate <= mismatchThreshold;
  const verdict: Verdict = pValueOk && mismatchOk ? 'LEGITIMATE' : 'FLAGGED';

  let reason: string;
  if (pValueOk && mismatchOk) {
    reason = `Signature is statistically consistent (p=${pValue.toFixed(4)}, mismatch=${(mismatchRate * 100).toFixed(2)}%)`;
  } else {
    const reasons: string[] = [];
    if (!pValueOk) {
      reasons.push(`p-value (${pValue.toFixed(4)}) below threshold (${alpha})`);
    }
    if (!mismatchOk) {
      reasons.push(
        `mismatch rate (${(mismatchRate * 100).toFixed(2)}%) exceeds threshold (${(mismatchThreshold * 100).toFixed(1)}%)`
      );
    }
    reason = `FLAGGED — ${reasons.join('; ')}`;
  }

  return {
    chiSquare: statistic,
    pValue,
    mismatchRate,
    alphaThreshold: alpha,
    mismatchThreshold,
    verdict,
    reason,
  };
}

/**
 * Combine per-basis detector verdicts into a single overall verdict —
 * flagged if any measured basis was flagged.
 */
export function detectMultiBasis(
  basisResults: SingleBasisResult[],
  _alpha: number,
  _mismatchThreshold: number
): { overallVerdict: Verdict; overallReason: string } {
  const flagged = basisResults.filter((r) => r.detector.verdict === 'FLAGGED');

  if (flagged.length === 0) {
    const overallReason =
      basisResults.length > 1
        ? 'Multi-basis measurement: signature verified across all bases'
        : (basisResults[0]?.detector.reason ?? 'Signature verified');
    return { overallVerdict: 'LEGITIMATE', overallReason };
  }

  const overallReason =
    basisResults.length > 1
      ? `FLAGGED — inconsistency detected in ${flagged.length} of ${basisResults.length} bases`
      : flagged[0].detector.reason;

  return { overallVerdict: 'FLAGGED', overallReason };
}
