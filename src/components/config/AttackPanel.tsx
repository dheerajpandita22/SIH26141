import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { AttackType } from '../../types/simulation';

interface AttackPanelProps {
  attack: AttackType;
  onAttackChange: (attack: AttackType) => void;
  channelDisturbanceProb: number;
  onChannelDisturbanceProbChange: (prob: number) => void;
}

const ATTACKS: { id: AttackType; label: string; desc: string }[] = [
  { id: 'none', label: 'No Attack', desc: 'Legitimate signature, no tampering' },
  { id: 'forgery', label: 'Forgery', desc: 'Attacker guesses an incorrect θ' },
  { id: 'impersonation', label: 'Impersonation', desc: 'Attacker sends a generic |+⟩ state' },
  { id: 'replay', label: 'Replay', desc: 'Attacker reuses a previous session nonce' },
  { id: 'channel_manipulation', label: 'Channel Manipulation', desc: 'Bit-flip disturbance in transit' },
];

export const AttackPanel: React.FC<AttackPanelProps> = ({
  attack,
  onAttackChange,
  channelDisturbanceProb,
  onChannelDisturbanceProbChange,
}) => {
  return (
    <div className="glass-card p-6 rounded-xl border border-red-900/30 bg-[#0c1220]/80">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-red-400" />
        <h3 className="text-lg font-semibold text-slate-100">Attack Scenario</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ATTACKS.map((a) => {
          const isSelected = attack === a.id;
          return (
            <button
              key={a.id}
              onClick={() => onAttackChange(a.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-red-900/30 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className={`font-semibold text-sm ${isSelected ? 'text-red-300' : 'text-slate-200'}`}>
                {a.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
            </button>
          );
        })}
      </div>

      {attack === 'channel_manipulation' && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Disturbance Probability</span>
            <span className="text-sm font-mono text-red-300">{channelDisturbanceProb}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={channelDisturbanceProb}
            onChange={(e) => onChannelDisturbanceProbChange(parseInt(e.target.value, 10))}
            className="w-full accent-red-500"
          />
        </div>
      )}
    </div>
  );
};
