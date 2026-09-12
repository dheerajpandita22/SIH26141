import React from 'react';
import { Key } from 'lucide-react';
import { ANGLE_PRESETS } from '../../types/simulation';

interface SignaturePanelProps {
  theta: number;
  onThetaChange: (theta: number) => void;
}

export const SignaturePanel: React.FC<SignaturePanelProps> = ({ theta, onThetaChange }) => {
  const p0 = Math.cos(theta / 2) ** 2;
  const p1 = Math.sin(theta / 2) ** 2;
  const degrees = (theta * 180 / Math.PI).toFixed(1);

  return (
    <div className="glass-card p-6 rounded-xl border border-cyan-900/30 bg-[#0c1220]/80">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-slate-100">Secret Angle θ</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Angle (Radians)</span>
            <span className="text-sm font-mono text-cyan-300">{theta.toFixed(3)} rad ({degrees}°)</span>
          </div>
          <input
            type="range"
            min="0"
            max={2 * Math.PI}
            step="0.01"
            value={theta}
            onChange={(e) => onThetaChange(parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        <div>
          <span className="text-sm text-slate-400 block mb-2">Presets</span>
          <div className="flex flex-wrap gap-2">
            {ANGLE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onThetaChange(preset.radians)}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                  Math.abs(theta - preset.radians) < 0.01
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-black/40 rounded-lg border border-white/5 space-y-3">
          <div className="text-sm font-mono text-slate-300 mb-2">
            |ψ⟩ = cos({(theta/2).toFixed(2)})|0⟩ + sin({(theta/2).toFixed(2)})|1⟩
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">P(|0⟩)</span>
                <span className="text-slate-300">{(p0 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${p0 * 100}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">P(|1⟩)</span>
                <span className="text-slate-300">{(p1 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${p1 * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
