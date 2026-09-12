export type Basis = 'Z' | 'X' | 'Y' | 'ALL';
export type AttackType = 'none' | 'forgery' | 'impersonation' | 'replay' | 'channel_manipulation';
export type Verdict = 'LEGITIMATE' | 'FLAGGED' | 'ANALYZING';

export interface QuantumState {
  theta: number;
  basis: Basis;
  prob0: number;
  prob1: number;
}

export interface MeasurementResult {
  basis: Basis;
  shots: number;
  expected0: number;
  expected1: number;
  observed0: number;
  observed1: number;
  mismatchRate: number;
  chiSquare: number;
  pValue: number;
  verdict: Verdict;
}

export interface SimulationRun {
  timestamp: number;
  theta: number;
  basis: Basis;
  shots: number;
  attackType: AttackType;
  pValue: number;
  mismatchRate: number;
  verdict: Verdict;
  measurements: MeasurementResult[];
}

export interface AttackInjection {
  type: AttackType;
  attackerTheta?: number;
  attackerThetaDiff?: number;
  channelDisturbanceProb?: number;
  channelDisturbanceOccurred?: boolean;
  nonceValid?: boolean;
  previousNonce?: string;
}

export interface ThreatDetectorResult {
  chiSquare: number;
  pValue: number;
  mismatchRate: number;
  alphaThreshold: number;
  mismatchThreshold: number;
  verdict: Verdict;
  reason: string;
}

export interface BatchResult {
  attack: AttackType;
  trials: number;
  flaggedCount: number;
  legitCount: number;
  flaggedRate: number;
  legitRate: number;
}

export interface ConfusionMatrixData {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface SessionData {
  sessionId: string;
  nonce: string;
  timestamp: number;
}
