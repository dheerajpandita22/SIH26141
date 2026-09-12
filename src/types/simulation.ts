// ============================================================
// SIH26141 Quantum Signature Simulation — Type Definitions
// ============================================================

/** Measurement basis for qubit observation */
export type MeasurementBasis = 'Z' | 'X' | 'Y' | 'ALL';

/** Attack scenario types */
export type AttackType = 'none' | 'forgery' | 'impersonation' | 'replay' | 'channel';

/** Simulation verdict */
export type Verdict = 'LEGITIMATE' | 'FLAGGED';

/** Stages of the simulation animation */
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

/** System status indicator */
export type SystemStatus = 'IDLE' | 'RUNNING' | 'ANALYZING' | 'SECURE' | 'ATTACK_DETECTED';

// ─── Configuration ─────────────────────────────────────────

export interface SimulationConfig {
  /** Secret rotation angle in radians (0 to 2π) */
  theta: number;
  /** Measurement basis */
  basis: MeasurementBasis;
  /** Number of measurement shots */
  shots: number;
  /** Attack type */
  attack: AttackType;
  /** Channel flip probability (0–1), used for channel manipulation attack */
  flipProbability: number;
  /** Optional random seed for reproducibility */
  seed?: number;
  /** Significance level α for chi-square test */
  alpha: number;
  /** Mismatch threshold for detection */
  mismatchThreshold: number;
}

export const DEFAULT_CONFIG: SimulationConfig = {
  theta: Math.PI / 3,
  basis: 'Z',
  shots: 2000,
  attack: 'none',
  flipProbability: 0.3,
  alpha: 0.05,
  mismatchThreshold: 0.15,
};

// ─── Quantum State ─────────────────────────────────────────

export interface QuantumState {
  /** Amplitude of |0⟩ */
  alpha: number;
  /** Amplitude of |1⟩ */
  beta: number;
}

export interface BasisProbabilities {
  /** Probability of measuring |0⟩ */
  p0: number;
  /** Probability of measuring |1⟩ */
  p1: number;
}

// ─── Measurement ───────────────────────────────────────────

export interface MeasurementCounts {
  /** Count of |0⟩ outcomes */
  count0: number;
  /** Count of |1⟩ outcomes */
  count1: number;
}

export interface BasisMeasurement {
  basis: MeasurementBasis;
  expected: BasisProbabilities;
  observed: BasisProbabilities;
  counts: MeasurementCounts;
  shots: number;
}

// ─── Attack Info ───────────────────────────────────────────

export interface AttackInfo {
  type: AttackType;
  /** Description of what happened */
  description: string;
  /** The attacker's theta (for forgery) */
  attackerTheta?: number;
  /** Angle difference (for forgery) */
  angleDifference?: number;
  /** Whether channel disturbance occurred (for channel manipulation) */
  channelDisturbed?: boolean;
  /** Flip probability used */
  flipProbability?: number;
  /** Whether nonce check passed (for replay) */
  nonceValid?: boolean;
}

// ─── Detector ──────────────────────────────────────────────

export interface DetectorResult {
  /** Chi-square statistic */
  chiSquare: number;
  /** p-value from chi-square test */
  pValue: number;
  /** Mismatch rate (|observed_p0 - expected_p0|) */
  mismatchRate: number;
  /** Final verdict */
  verdict: Verdict;
  /** Explanation of why flagged (if applicable) */
  reason: string;
  /** Alpha threshold used */
  alpha: number;
  /** Mismatch threshold used */
  mismatchThreshold: number;
}

export interface MultiBasisDetectorResult {
  Z?: DetectorResult;
  X?: DetectorResult;
  Y?: DetectorResult;
  /** Overall verdict: FLAGGED if any basis is flagged */
  overallVerdict: Verdict;
  /** Overall reason */
  overallReason: string;
}

// ─── Session / Replay ──────────────────────────────────────

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
  previousSession?: SessionInfo;
}

// ─── Simulation Result ─────────────────────────────────────

export interface SingleBasisResult {
  basis: Exclude<MeasurementBasis, 'ALL'>;
  expected: BasisProbabilities;
  observed: BasisProbabilities;
  counts: MeasurementCounts;
  detector: DetectorResult;
}

export interface SimulationResult {
  /** Unique ID for this run */
  id: string;
  /** Timestamp */
  timestamp: number;
  /** Configuration used */
  config: SimulationConfig;
  /** The quantum state prepared */
  signatureState: QuantumState;
  /** Attack information */
  attackInfo: AttackInfo;
  /** Per-basis results */
  basisResults: SingleBasisResult[];
  /** Overall verdict */
  verdict: Verdict;
  /** Overall reason */
  reason: string;
  /** Session info (for replay attack) */
  sessionValidation?: SessionValidation;
}

// ─── History Entry ─────────────────────────────────────────

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

// ─── Batch Evaluation ──────────────────────────────────────

export interface ConfusionMatrix {
  tp: number;
  tn: number;
  fp: number;
  fn: number;
}

export interface BatchMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusion: ConfusionMatrix;
}

export interface AttackDetectionRate {
  attackType: AttackType;
  label: string;
  totalTrials: number;
  flaggedCount: number;
  flaggedRate: number;
}

export interface BatchResult {
  /** Number of trials per condition */
  trialsPerCondition: number;
  /** Overall metrics */
  metrics: BatchMetrics;
  /** Per-attack detection rates */
  detectionRates: AttackDetectionRate[];
  /** All individual results (for debugging) */
  allResults: Array<{
    attack: AttackType;
    verdict: Verdict;
    expectedVerdict: Verdict;
  }>;
  /** Timestamp */
  timestamp: number;
}

// ─── Demo Mode ─────────────────────────────────────────────

export interface DemoStep {
  id: number;
  title: string;
  description: string;
  config: Partial<SimulationConfig>;
  /** Auto-run simulation */
  autoRun: boolean;
}

// ─── Tab Navigation ────────────────────────────────────────

export type AppTab = 'overview' | 'dashboard' | 'simulation' | 'attacks' | 'batch' | 'history';

// ─── Angle Presets ─────────────────────────────────────────

export interface AnglePreset {
  label: string;
  degrees: number;
  radians: number;
}

export const ANGLE_PRESETS: AnglePreset[] = [
  { label: '0°', degrees: 0, radians: 0 },
  { label: '30°', degrees: 30, radians: Math.PI / 6 },
  { label: '45°', degrees: 45, radians: Math.PI / 4 },
  { label: '60°', degrees: 60, radians: Math.PI / 3 },
  { label: '90°', degrees: 90, radians: Math.PI / 2 },
  { label: '120°', degrees: 120, radians: (2 * Math.PI) / 3 },
  { label: '180°', degrees: 180, radians: Math.PI },
  { label: '270°', degrees: 270, radians: (3 * Math.PI) / 2 },
  { label: '360°', degrees: 360, radians: 2 * Math.PI },
];

// ─── Shots Presets ─────────────────────────────────────────

export const SHOT_PRESETS: number[] = [100, 500, 1000, 2000, 5000, 10000];
