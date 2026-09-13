export type Basis = 'Z' | 'X' | 'Y' | 'ALL';
export type MeasurementBasis = Basis;
export type AttackType = 'none' | 'forgery' | 'impersonation' | 'replay' | 'channel_manipulation';
export type Verdict = 'LEGITIMATE' | 'FLAGGED' | 'ANALYZING';
export type AppTab = 'overview' | 'dashboard' | 'simulation' | 'attacks' | 'batch' | 'history';

export type SimulationStage =
  | 'idle'
  | 'preparing'
  | 'bell-pair'
  | 'teleporting'
  | 'channel'
  | 'attacking'
  | 'measuring'
  | 'comparing'
  | 'detecting'
  | 'complete';

export interface QuantumState {
  theta: number;
  basis: Basis;
  prob0: number;
  prob1: number;
}

export interface BasisProbabilities {
  p0: number;
  p1: number;
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

/** Per-attack aggregate used internally by MetricsCalculator */
export interface AttackTrialResult {
  attack: AttackType;
  trials: number;
  flaggedCount: number;
  legitCount: number;
  flaggedRate: number;
  legitRate: number;
}

export interface SessionInfo {
  sessionId: string;
  nonce: string;
  timestamp: number;
  signatureId: string;
  isReplay: boolean;
}

export interface SessionValidation {
  isValid: boolean;
  reason: string;
  currentSession: SessionInfo;
}

export interface SimulationConfig {
  theta: number;
  basis: MeasurementBasis;
  shots: number;
  attack: AttackType;
  alpha: number;
  mismatchThreshold: number;
  channelDisturbanceProb: number;
  seed?: number;
}

export interface SingleBasisResult {
  basis: Exclude<MeasurementBasis, 'ALL'>;
  expected: BasisProbabilities;
  observed: BasisProbabilities;
  counts: { count0: number; count1: number };
  detector: ThreatDetectorResult;
}

export interface SimulationResult {
  id: string;
  timestamp: number;
  config: SimulationConfig;
  signatureState: QuantumState;
  attackInfo: AttackInjection;
  basisResults: SingleBasisResult[];
  verdict: Verdict;
  reason: string;
  sessionValidation: SessionValidation;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  theta: number;
  basis: MeasurementBasis;
  shots: number;
  attack: AttackType;
  pValue: number;
  mismatchRate: number;
  verdict: Verdict;
}

export interface BatchMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusion: { tp: number; tn: number; fp: number; fn: number };
}

export interface AttackDetectionRate {
  attackType: AttackType;
  label: string;
  totalTrials: number;
  flaggedCount: number;
  flaggedRate: number;
}

export interface BatchResult {
  trialsPerCondition: number;
  metrics: BatchMetrics;
  detectionRates: AttackDetectionRate[];
  allResults: Array<{ attack: AttackType; verdict: Verdict; expectedVerdict: Verdict }>;
  timestamp: number;
}

export const ANGLE_PRESETS: { label: string; radians: number }[] = [
  { label: '0°', radians: 0 },
  { label: '30°', radians: Math.PI / 6 },
  { label: '45°', radians: Math.PI / 4 },
  { label: '60°', radians: Math.PI / 3 },
  { label: '90°', radians: Math.PI / 2 },
  { label: '120°', radians: (2 * Math.PI) / 3 },
  { label: '180°', radians: Math.PI },
];

export const SHOT_PRESETS: number[] = [100, 500, 1000, 2000, 5000, 10000];
