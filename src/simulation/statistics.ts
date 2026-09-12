import { MeasurementCounts, BasisProbabilities } from '../types/simulation';
import { RNG } from '../utils/random';

export function sampleMeasurements(p0: number, shots: number, rng: RNG): MeasurementCounts {
    if (shots > 100) {
        const mean = shots * p0;
        const stdDev = Math.sqrt(shots * p0 * (1 - p0));
        
        const u1 = rng();
        const u2 = rng();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        
        let count0 = Math.round(mean + z0 * stdDev);
        count0 = Math.max(0, Math.min(shots, count0));
        return {
            count0,
            count1: shots - count0
        };
    } else {
        let count0 = 0;
        for (let i = 0; i < shots; i++) {
            if (rng() < p0) {
                count0++;
            }
        }
        return {
            count0,
            count1: shots - count0
        };
    }
}

export function chiSquareStatistic(observed: MeasurementCounts, expected: BasisProbabilities, shots: number): number {
    const expected0 = expected.p0 * shots;
    const expected1 = expected.p1 * shots;
    
    let chiSq = 0;
    if (expected0 > 0) {
        chiSq += Math.pow(observed.count0 - expected0, 2) / expected0;
    }
    if (expected1 > 0) {
        chiSq += Math.pow(observed.count1 - expected1, 2) / expected1;
    }
    return chiSq;
}

function gammaFunction(z: number): number {
    const g = 7;
    const p = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFunction(1 - z));
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
        x += p[i] / (z + i);
    }
    let t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function lowerIncompleteGamma(a: number, x: number): number {
    const maxIter = 200;
    const epsilon = 1e-15;
    let sum = 1 / a;
    let term = 1 / a;
    let n = 1;
    
    while (n < maxIter) {
        term *= x / (a + n);
        sum += term;
        if (term < sum * epsilon) break;
        n++;
    }
    
    return sum * Math.exp(-x + a * Math.log(x));
}

export function chiSquarePValue(chiSq: number, df: number): number {
    if (chiSq === 0) return 1;
    const a = df / 2;
    const x = chiSq / 2;
    const gammaA = gammaFunction(a);
    const incGamma = lowerIncompleteGamma(a, x);
    const cdf = incGamma / gammaA;
    return 1 - cdf;
}

export function calculateMismatchRate(observed: BasisProbabilities, expected: BasisProbabilities): number {
    return Math.abs(observed.p0 - expected.p0);
}
