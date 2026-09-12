import React from 'react';
import { SimulationResult } from '../../types/simulation';
import { Shield, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface ThreatDetectorProps {
  result: SimulationResult | null;
}

const ThreatDetector: React.FC<ThreatDetectorProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px] border-slate-700">
        <Shield size={48} className="text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-400">THREAT DETECTOR</h3>
        <p className="text-slate-500 mt-2 text-center">Run a simulation to see results</p>
      </div>
    );
  }

  const isLegitimate = result.verdict === 'LEGITIMATE';
  const cardGlowClass = isLegitimate ? 'shadow-[0_0_30px_rgba(16,185,129,0.2)] border-green-500/30' : 'shadow-[0_0_30px_rgba(239,68,68,0.2)] border-red-500/30';
  
  return (
    <div className={`glass-card p-6 transition-all duration-500 ${cardGlowClass}`}>
      <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
        {isLegitimate ? <Shield className="text-green-500" size={28} /> : <ShieldAlert className="text-red-500" size={28} />}
        <h3 className="text-xl font-bold text-white tracking-wider">THREAT DETECTOR</h3>
      </div>

      <div className="flex flex-col items-center justify-center mb-8">
        <div className={`flex flex-col items-center justify-center py-6 px-12 rounded-2xl w-full max-w-md ${isLegitimate ? 'bg-green-950/40 border border-green-800/50' : 'bg-red-950/40 border border-red-800/50'}`}>
          <div className={`flex items-center gap-3 text-3xl font-black tracking-widest ${isLegitimate ? 'text-green-500 verdict-legitimate' : 'text-red-500 verdict-flagged'}`}>
            {isLegitimate ? <CheckCircle size={36} /> : <AlertTriangle size={36} />}
            {result.verdict}
          </div>
          {!isLegitimate && (
            <p className="mt-4 text-red-400 font-semibold text-center bg-red-950/60 py-2 px-4 rounded-lg w-full">
              {result.reason}
            </p>
          )}
        </div>
      </div>

      {result.sessionValidation && (
        <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <h4 className="text-sm font-bold text-slate-300 uppercase mb-2">Session Validation</h4>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Status:</span>
            <span className={`font-bold ${result.sessionValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {result.sessionValidation.isValid ? 'VALID' : 'INVALID'}
            </span>
          </div>
          {!result.sessionValidation.isValid && (
            <div className="text-sm text-red-400 mt-1">{result.sessionValidation.reason}</div>
          )}
        </div>
      )}

      <div className="space-y-6">
        {result.basisResults.map((basisResult, idx) => {
          const detector = basisResult.detector;
          return (
            <div key={idx} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
              <h4 className="text-cyan-400 font-bold mb-4 border-b border-slate-700/50 pb-2">
                Basis {basisResult.basis} Analysis
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm font-mono">
                <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                  <span className="text-slate-400">Chi² Statistic:</span>
                  <span className="text-white">{detector.chiSquare.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                  <span className="text-slate-400">p-value:</span>
                  <span className={`${detector.pValue < detector.alpha ? 'text-red-400 font-bold' : 'text-green-400'}`}>
                    {detector.pValue.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                  <span className="text-slate-400">Mismatch:</span>
                  <span className={`${detector.mismatchRate > detector.mismatchThreshold ? 'text-red-400 font-bold' : 'text-white'}`}>
                    {(detector.mismatchRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                  <span className="text-slate-400">α Threshold:</span>
                  <span className="text-slate-300">{detector.alpha}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded col-span-2 md:col-span-1">
                  <span className="text-slate-400">Mismatch Threshold:</span>
                  <span className="text-slate-300">{(detector.mismatchThreshold * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreatDetector;
