import React from 'react';
import { Target, Dice5 } from 'lucide-react';
import { SHOT_PRESETS } from '../../types/simulation';

interface ShotsControlProps {
  shots: number;
  onShotsChange: (shots: number) => void;
  seed?: number;
  onSeedChange: (seed?: number) => void;
}

export const ShotsControl: React.FC<ShotsControlProps> = ({ shots, onShotsChange, seed, onSeedChange }) => {
  return (
    <div className="glass-card p-6 rounded-xl border border-cyan-900/30 bg-[#0c1220]/80">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-slate-100">Measurement Shots</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <input
            type="number"
            min="1"
            max="100000"
            value={shots}
            onChange={(e) => onShotsChange(parseInt(e.target.value) || 1000)}
            className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div>
          <span className="text-sm text-slate-400 block mb-2">Presets</span>
          <div className="flex flex-wrap gap-2">
            {SHOT_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => onShotsChange(preset)}
                className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                  shots === preset
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Dice5 className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-300">Random Seed (Optional)</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={seed !== undefined}
                onChange={(e) => onSeedChange(e.target.checked ? 12345 : undefined)}
              />
              <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
            {seed !== undefined && (
              <input
                type="number"
                value={seed}
                onChange={(e) => onSeedChange(parseInt(e.target.value) || 0)}
                className="w-24 bg-black/40 border border-white/10 rounded-md px-2 py-1 text-slate-200 text-sm focus:outline-none focus:border-purple-500/50"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
