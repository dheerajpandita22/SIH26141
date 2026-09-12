import { QuantumState, Basis } from '../types/simulation';

/**
 * Calculate quantum state probabilities based on the rotation angle θ
 * Signature state: RY(θ)|0> = cos(θ/2)|0> + sin(θ/2)|1>
 */
export function calculateQuantumState(theta: number, basis: Basis): QuantumState {
  let prob0 = 0;
  let prob1 = 0;

  const halfTheta = theta / 2;
  const cosHalf = Math.cos(halfTheta);
  const sinHalf = Math.sin(halfTheta);
  const sinTheta = Math.sin(theta);

  switch (basis) {
    case 'Z':
      // P(0) = cos²(θ/2)
      // P(1) = sin²(θ/2)
      prob0 = cosHalf * cosHalf;
      prob1 = sinHalf * sinHalf;
      break;

    case 'X':
      // P(0) = 0.5 × (1 + sin(θ))
      // P(1) = 0.5 × (1 - sin(θ))
      prob0 = 0.5 * (1 + sinTheta);
      prob1 = 0.5 * (1 - sinTheta);
      break;

    case 'Y':
      // P(0) = 0.5
      // P(1) = 0.5
      prob0 = 0.5;
      prob1 = 0.5;
      break;

    case 'ALL':
      // Default to Z basis for ALL
      prob0 = cosHalf * cosHalf;
      prob1 = sinHalf * sinHalf;
      break;
  }

  return {
    theta,
    basis,
    prob0: Math.max(0, Math.min(1, prob0)),
    prob1: Math.max(0, Math.min(1, prob1)),
  };
}

/**
 * Convert radians to degrees
 */
export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Normalize angle to [0, 2π)
 */
export function normalizeAngle(angle: number): number {
  const tau = 2 * Math.PI;
  return ((angle % tau) + tau) % tau;
}
