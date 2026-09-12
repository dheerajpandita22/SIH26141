import React from 'react';
import { MeasurementBasis } from '../../types/simulation';
import { getTheoreticalProbabilities } from '../../simulation/quantumState';

interface MeasurementPanelProps {
  basis: MeasurementBasis;
  onBasisChange: (basis: MeasurementBasis) => void;
  theta: number;
}

const BASES: { id: MeasurementBasis; label: string; desc: string }[] = [
  { id: 'Z', label: 'Z Basis', desc: 'Computational basis - measures |0⟩/|1⟩' },
  { id: 'X', label: 'X Basis', desc: 'Hadamard basis - measures |+⟩/|-⟩' },
  { id: 'Y', label: 'Y Basis', desc: 'Circular basis - measures |↻⟩/|↺⟩' },
  { id: 'ALL', label: 'ALL Bases', desc: 'All three bases combined' },
];

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({ basis, onBasisChange, theta }) => {
  return (
    <div className="glass-card p-6 rounded-xl border border-cyan-900/30 bg-[#0c1220]/80">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Measurement Basis</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BASES.map((b) => {
          const isSelected = basis === b.id;
          
          let p0 = 0, p1 = 0;
          if (b.id !== 'ALL') {
            const probs = getTheoreticalProbabilities(theta, b.id);
            p0 = probs.p0;
            p1 = probs.p1;
          }

          return (
            <button
              key={b.id}
              onClick={() => onBasisChange(b.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className={`font-semibold mb-1 ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                {b.label}
              </div>
              <div className="text-xs text-slate-400 mb-3">{b.desc}</div>
              
              {b.id !== 'ALL' && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-4">P0</span>
                    <div className="flex-1 bg-black/40 rounded-full h-1">
                      <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${p0 * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 w-6 text-right">{(p0 * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-4">P1</span>
                    <div className="flex-1 bg-black/40 rounded-full h-1">
                      <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${p1 * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 w-6 text-right">{(p1 * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
              {b.id === 'ALL' && (
                <div className="text-xs text-cyan-400/80 italic mt-2">
                  Comprehensive multi-basis verification
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
