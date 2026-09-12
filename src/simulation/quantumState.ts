import { QuantumState, BasisProbabilities } from '../types/simulation';

export function prepareSignatureState(theta: number): QuantumState {
    return {
        alpha: Math.cos(theta / 2),
        beta: Math.sin(theta / 2)
    };
}

export function getTheoreticalProbabilities(theta: number, basis: 'Z' | 'X' | 'Y'): BasisProbabilities {
    switch (basis) {
        case 'Z':
            return {
                p0: Math.pow(Math.cos(theta / 2), 2),
                p1: Math.pow(Math.sin(theta / 2), 2)
            };
        case 'X':
            const p0x = 0.5 * (1 + Math.sin(theta));
            return {
                p0: p0x,
                p1: 1 - p0x
            };
        case 'Y':
            return {
                p0: 0.5,
                p1: 0.5
            };
        default:
            throw new Error(`Unknown basis: ${basis}`);
    }
}

export function formatStateKet(state: QuantumState): string {
    return `cos(θ/2)|0⟩ + sin(θ/2)|1⟩`;
}
