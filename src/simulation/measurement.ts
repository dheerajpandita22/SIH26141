import { Basis } from '../types/simulation';

/**
 * Seeded random number generator for reproducibility
 */
class SeededRandom {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed !== undefined ? seed : Date.now();
  }

  public next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

/**
 * Generate measurement results based on probabilities
 */
export function generateMeasurementResults(
  prob0: number,
  shots: number,
  seed?: number
): { count0: number; count1: number } {
  const rng = new SeededRandom(seed);
  let count0 = 0;
  let count1 = 0;

  for (let i = 0; i < shots; i++) {
    if (rng.next() < prob0) {
      count0++;
    } else {
      count1++;
    }
  }

  return { count0, count1 };
}

/**
 * Simulate measurement results with statistical variation
 */
export function simulateMeasurement(
  prob0: number,
  shots: number,
  seed?: number
): { observed0: number; observed1: number; pct0: number; pct1: number } {
  const { count0, count1 } = generateMeasurementResults(prob0, shots, seed);

  return {
    observed0: count0,
    observed1: count1,
    pct0: (count0 / shots) * 100,
    pct1: (count1 / shots) * 100,
  };
}

/**
 * Calculate mismatch rate between expected and observed
 */
export function calculateMismatchRate(
  expected0: number,
  expected1: number,
  observed0: number,
  observed1: number,
  shots: number
): number {
  const expectedCount0 = expected0 * shots;
  const expectedCount1 = expected1 * shots;

  const diff0 = Math.abs(observed0 - expectedCount0);
  const diff1 = Math.abs(observed1 - expectedCount1);

  const mismatch = (diff0 + diff1) / (2 * shots);
  return Math.min(1, Math.max(0, mismatch));
}
