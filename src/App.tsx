import { useState, useCallback, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';

import { Header } from './components/layout/Header';
import { LandingHero } from './components/educational/LandingHero';
import { HowItWorks } from './components/educational/HowItWorks';
import { TechnicalDetails } from './components/educational/TechnicalDetails';

import { SignaturePanel } from './components/config/SignaturePanel';
import { MeasurementPanel } from './components/config/MeasurementPanel';
import { ShotsControl } from './components/config/ShotsControl';
import { AttackPanel } from './components/config/AttackPanel';

import BlochSphere from './components/simulation/BlochSphere';
import QuantumCircuit from './components/simulation/QuantumCircuit';
import QuantumFlowDiagram from './components/simulation/QuantumFlowDiagram';
import SimulationRunner from './components/simulation/SimulationRunner';

import ThreatDetector from './components/results/ThreatDetector';
import MeasurementResults from './components/results/MeasurementResults';
import MultiBasisResults from './components/results/MultiBasisResults';

import { ConfusionMatrix } from './components/ConfusionMatrix';
import { DetectionRateChart } from './components/Charts';
import { ExportButtons } from './components/ExportButtons';
import { SimulationHistory } from './components/SimulationHistory';
import { StatusBadge, VerdictCard } from './components/StatusBadge';

import { runFullSimulation } from './simulation/runSimulation';
import { useHistory } from './hooks/useHistory';
import { useBatchEval } from './hooks/useBatchEval';
import {
  exportHistoryCSV,
  exportHistoryJSON,
  exportBatchCSV,
  exportBatchJSON,
} from './utils/export';

import type {
  AppTab,
  Basis,
  AttackType,
  SimulationConfig,
  SimulationResult,
  SimulationStage,
} from './types/simulation';

const ALPHA = 0.05;
const MISMATCH_THRESHOLD = 0.15;

const STAGE_SEQUENCE: SimulationStage[] = [
  'preparing',
  'bell-pair',
  'teleporting',
  'channel',
  'attacking',
  'measuring',
  'comparing',
  'detecting',
  'complete',
];

const ALL_ATTACKS: AttackType[] = ['none', 'forgery', 'impersonation', 'replay', 'channel_manipulation'];

function App() {
  // ─── Navigation ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // ─── Shared signature/measurement config ────────────────
  const [theta, setTheta] = useState(Math.PI / 4);
  const [basis, setBasis] = useState<Basis>('Z');
  const [shots, setShots] = useState(1000);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [attack, setAttack] = useState<AttackType>('none');
  const [channelDisturbanceProb, setChannelDisturbanceProb] = useState(30);

  // ─── Single-run simulation state ────────────────────────
  const [stage, setStage] = useState<SimulationStage>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const usedNoncesRef = useRef<Set<string>>(new Set());

  // ─── Attack Lab comparison state ────────────────────────
  const [compareResults, setCompareResults] = useState<
    Array<{ attack: AttackType; result: SimulationResult }>
  >([]);
  const [isComparing, setIsComparing] = useState(false);

  // ─── Batch analysis state ────────────────────────────────
  const [trialsPerCondition, setTrialsPerCondition] = useState(100);
  const { batchResult, isRunning: batchIsRunning, progress, runBatch } = useBatchEval();

  // ─── History ─────────────────────────────────────────────
  const { history, addEntry, clearHistory } = useHistory();

  const buildConfig = useCallback(
    (overrideAttack?: AttackType): SimulationConfig => ({
      theta,
      basis,
      shots,
      attack: overrideAttack ?? attack,
      alpha: ALPHA,
      mismatchThreshold: MISMATCH_THRESHOLD,
      channelDisturbanceProb,
      seed,
    }),
    [theta, basis, shots, attack, channelDisturbanceProb, seed]
  );

  const toggleDemo = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      if (next) {
        setActiveTab('simulation');
        setTheta(Math.PI / 3);
        setBasis('ALL');
        setAttack('forgery');
      }
      return next;
    });
  }, []);

  const runSingleSimulation = useCallback(async () => {
    setIsRunning(true);
    setSimResult(null);
    for (const s of STAGE_SEQUENCE) {
      setStage(s);
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    const result = runFullSimulation(buildConfig(), usedNoncesRef.current);
    setSimResult(result);
    addEntry(result);
    setIsRunning(false);
  }, [buildConfig, addEntry]);

  const resetSimulation = useCallback(() => {
    setStage('idle');
    setSimResult(null);
  }, []);

  const runAttackComparison = useCallback(() => {
    setIsComparing(true);
    const nonces = new Set<string>();
    const results = ALL_ATTACKS.map((a) => ({
      attack: a,
      result: runFullSimulation(buildConfig(a), nonces),
    }));
    setCompareResults(results);
    setIsComparing(false);
  }, [buildConfig]);

  const handleRunBatch = useCallback(() => {
    runBatch(buildConfig('none'), trialsPerCondition);
  }, [runBatch, buildConfig, trialsPerCondition]);

  return (
    <div className="min-h-screen bg-grid-pattern">
      <Header activeTab={activeTab} onTabChange={setActiveTab} isDemoMode={isDemoMode} onToggleDemo={toggleDemo} />

      {isDemoMode && (
        <div className="demo-banner px-4 py-2 text-center text-sm text-purple-200">
          Demo Mode — a forgery attack at θ = 60° is preloaded on the Simulation tab. Press "Run Simulation" to watch it get flagged.
        </div>
      )}

      {activeTab === 'overview' && (
        <>
          <LandingHero onLaunchSimulation={() => setActiveTab('simulation')} />
          <div className="max-w-5xl mx-auto px-4 pb-16 space-y-4">
            <HowItWorks />
            <TechnicalDetails />
          </div>
        </>
      )}

      {activeTab === 'dashboard' && (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="metric-card">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Simulations</div>
              <div className="metric-value">{history.length}</div>
            </div>
            <div className="metric-card">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current θ</div>
              <div className="metric-value">{((theta * 180) / Math.PI).toFixed(0)}°</div>
            </div>
            <div className="metric-card">
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Selected Attack</div>
              <div className="metric-value text-lg capitalize">{attack.replace('_', ' ')}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BlochSphere theta={theta} />
            {simResult ? (
              <VerdictCard verdict={simResult.verdict} reason={simResult.reason} />
            ) : (
              <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <p className="text-slate-400">No simulation run yet — head to the Simulation tab to get started.</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('simulation')}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors"
            >
              Go to Simulation →
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              Run Batch Analysis →
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
            >
              View History →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <SignaturePanel theta={theta} onThetaChange={setTheta} />
            <MeasurementPanel basis={basis} onBasisChange={setBasis} theta={theta} />
            <ShotsControl shots={shots} onShotsChange={setShots} seed={seed} onSeedChange={setSeed} />
            <AttackPanel
              attack={attack}
              onAttackChange={setAttack}
              channelDisturbanceProb={channelDisturbanceProb}
              onChannelDisturbanceProbChange={setChannelDisturbanceProb}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <SimulationRunner stage={stage} isRunning={isRunning} onRun={runSingleSimulation} onReset={resetSimulation} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlochSphere theta={theta} />
              <QuantumFlowDiagram stage={stage} attack={attack} />
            </div>
            <QuantumCircuit theta={theta} stage={stage} />
            <ThreatDetector result={simResult} />
            <MeasurementResults result={simResult} />
            <MultiBasisResults result={simResult} />
          </div>
        </div>
      )}

      {activeTab === 'attacks' && (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">Attack Lab</h2>
                <p className="text-sm text-slate-400">
                  Runs θ = {((theta * 180) / Math.PI).toFixed(1)}°, {shots} shots, basis {basis} against every attack type at once.
                </p>
              </div>
              <button
                onClick={runAttackComparison}
                disabled={isComparing}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white font-bold transition-colors whitespace-nowrap"
              >
                {isComparing ? 'Running...' : 'Compare All Attacks'}
              </button>
            </div>
          </div>

          {compareResults.length === 0 ? (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400">Run the comparison to see how the detector responds to each attack type.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {compareResults.map(({ attack: a, result }) => {
                const primary = result.basisResults[0];
                return (
                  <div key={a} className="glass-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-200 capitalize">{a.replace('_', ' ')}</h3>
                      <StatusBadge verdict={result.verdict} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{result.reason}</p>
                    {primary && (
                      <div className="text-xs font-mono text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>p-value</span>
                          <span className="text-slate-200">{primary.detector.pValue.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>mismatch</span>
                          <span className="text-slate-200">{(primary.detector.mismatchRate * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">Batch Analysis</h2>
                <p className="text-sm text-slate-400">Run many trials per attack condition and compute detection accuracy.</p>
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Trials per condition</label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={trialsPerCondition}
                    onChange={(e) => setTrialsPerCondition(parseInt(e.target.value, 10) || 100)}
                    className="w-28 bg-black/40 border border-white/10 rounded-md px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <button
                  onClick={handleRunBatch}
                  disabled={batchIsRunning}
                  className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-bold transition-colors whitespace-nowrap"
                >
                  {batchIsRunning ? `Running ${progress}%` : 'Run Batch'}
                </button>
              </div>
            </div>
            {batchIsRunning && (
              <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-cyan-500 h-2 transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>

          {batchResult && (
            <>
              <ConfusionMatrix
                data={{
                  tp: batchResult.metrics.confusion.tp,
                  tn: batchResult.metrics.confusion.tn,
                  fp: batchResult.metrics.confusion.fp,
                  fn: batchResult.metrics.confusion.fn,
                  accuracy: batchResult.metrics.accuracy,
                  precision: batchResult.metrics.precision,
                  recall: batchResult.metrics.recall,
                  f1Score: batchResult.metrics.f1,
                }}
              />
              <DetectionRateChart
                data={batchResult.detectionRates.map((d) => ({
                  name: d.label,
                  rate: parseFloat((d.flaggedRate * 100).toFixed(1)),
                }))}
              />
              <div className="glass-card p-6 flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-slate-200">Export Results</h3>
                <ExportButtons onExportCSV={() => exportBatchCSV(batchResult)} onExportJSON={() => exportBatchJSON(batchResult)} />
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold text-slate-100">Simulation History</h2>
            <ExportButtons onExportCSV={() => exportHistoryCSV(history)} onExportJSON={() => exportHistoryJSON(history)} />
          </div>
          <SimulationHistory history={history} onClear={clearHistory} />
        </div>
      )}
    </div>
  );
}

export default App;
