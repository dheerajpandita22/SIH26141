import { BasisProbabilities, SingleBasisResult } from '../types/simulation';
import { RNG } from '../utils/random';
import { getTheoreticalProbabilities } from './quantumState';
import { sampleMeasurements } from './statistics';

export function simulateMeasurement(theta: number, basis: 'Z' | 'X' | 'Y', shots: number, rng: RNG): Omit<SingleBasisResult, 'detector'> {
    const expected = getTheoreticalProbabilities(theta, basis);
    const counts = sampleMeasurements(expected.p0, shots, rng);
    const observed: BasisProbabilities = {
        p0: counts.count0 / shots,
        p1: counts.count1 / shots
    };
    return {
        basis,
        expected,
        observed,
        counts
    };
}

export function simulateAllBases(theta: number, shots: number, rng: RNG): Array<Omit<SingleBasisResult, 'detector'>> {
    return [
        simulateMeasurement(theta, 'Z', shots, rng),
        simulateMeasurement(theta, 'X', shots, rng),
        simulateMeasurement(theta, 'Y', shots, rng)
    ];
}
