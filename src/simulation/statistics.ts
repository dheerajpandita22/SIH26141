import type { RNG } from '../utils/random';

/**
 * Draw `shots` binary samples from a Bernoulli(p0) distribution using
 * the supplied seeded RNG, returning the observed counts.
 */
export function sampleMeasurements(
  p0: number,
  shots: number,
  rng: RNG
): { count0: number; count1: number } {
  let count0 = 0;
  for (let i = 0; i < shots; i++) {
    if (rng() < p0) count0++;
  }
  return { count0, count1: shots - count0 };
}

/**
 * Chi-square goodness-of-fit test
 * Compares observed vs expected frequencies
 */
export function chiSquareTest(
  observed0: number,
  observed1: number,
  expected0: number,
  expected1: number,
  shots: number
): { statistic: number; pValue: number } {
  const expectedCount0 = expected0 * shots;
  const expectedCount1 = expected1 * shots;

  // Avoid division by zero
  if (expectedCount0 === 0 || expectedCount1 === 0) {
    return { statistic: 0, pValue: 1 };
  }

  const chi2 =
    Math.pow(observed0 - expectedCount0, 2) / expectedCount0 +
    Math.pow(observed1 - expectedCount1, 2) / expectedCount1;

  // Approximate p-value using chi-square CDF for 1 degree of freedom
  const pValue = chiSquareCDF(chi2, 1);

  return {
    statistic: chi2,
    pValue: 1 - pValue, // Return p-value as 1 - CDF
  };
}

/**
 * Approximate chi-square CDF (cumulative distribution function)
 * For 1 degree of freedom
 */
function chiSquareCDF(x: number, df: number): number {
  if (x < 0) return 0;
  if (df === 1) {
    // Use error function approximation
    return erf(Math.sqrt(x / 2));
  }
  // Approximation for other degrees of freedom
  return incompleteBeta(df / 2, 0.5, x / (x + df));
}

/**
 * Error function (approximation)
 */
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Incomplete beta function (approximation)
 */
function incompleteBeta(
  a: number,
  b: number,
  x: number
): number {
  if (x === 0) return 0;
  if (x === 1) return 1;

  const front = Math.exp(
    a * Math.log(x) + b * Math.log(1 - x) - logBeta(a, b)
  );

  if (x < (a + 1) / (a + b + 2)) {
    return front * betaContinuedFraction(a, b, x) / a;
  } else {
    return (
      1 -
      front * betaContinuedFraction(b, a, 1 - x) / b
    );
  }
}

/**
 * Beta function logarithm
 */
function logBeta(a: number, b: number): number {
  return logGamma(a) + logGamma(b) - logGamma(a + b);
}

/**
 * Continued fraction for incomplete beta
 */
function betaContinuedFraction(
  a: number,
  b: number,
  x: number
): number {
  const maxIterations = 100;
  const epsilon = 3e-7;

  let am = 1;
  let bm = 1;
  let az = 1;
  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let bz = 1 - (qab * x) / qap;

  for (let m = 1; m <= maxIterations; m++) {
    const em = m;
    const tem = 2 * em;
    let d = (em * (b - em) * x) / ((qam + tem) * (a + tem));
    let ap = az + d * am;
    let bp = bz + d * bm;
    d = -((a + em) * (qab + em) * x) / ((qap + tem) * (a + tem));
    const app = ap + d * az;
    const bpp = bp + d * bz;
    const aold = az;
    am = ap / bpp;
    bm = bp / bpp;
    az = app / bpp;
    bz = 1;
    if (Math.abs(az - aold) < epsilon * Math.abs(az)) {
      return az;
    }
  }

  return az;
}

/**
 * Logarithm of gamma function (Stirling's approximation)
 */
function logGamma(x: number): number {
  const g = 7;
  const coef = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  if (x < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  }

  x -= 1;
  let base = x + g + 0.5;
  let sum = coef[0];

  for (let i = 1; i < coef.length; i++) {
    sum += coef[i] / (x + i);
  }

  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(base) - base + Math.log(sum);
}
