import React, { useState } from 'react';
import { Code, ChevronDown, ChevronUp } from 'lucide-react';

export const TechnicalDetails: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card border border-purple-900/30 rounded-xl overflow-hidden bg-[#0c1220]/80">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-slate-100">Technical Details</h2>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Quantum States & Probabilities</h3>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-xs text-slate-300 space-y-2">
                <div>Signature: RY(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩</div>
                <div className="pt-2 border-t border-white/10 text-cyan-300">Z basis: P(|0⟩) = cos²(θ/2)</div>
                <div className="text-purple-300">X basis: P(|0⟩) = ½(1 + sin θ)</div>
                <div className="text-emerald-300">Y basis: P(|0⟩) = ½</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Statistical Detection</h3>
              <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-xs text-slate-300 space-y-2">
                <div>Chi-square: χ² = Σ (Oᵢ - Eᵢ)² / Eᵢ</div>
                <div>Significance level: α = 0.05</div>
                <div>Mismatch threshold: 15%</div>
                <div className="pt-2 border-t border-white/10 text-rose-300">
                  Verdict rule: LEGITIMATE if<br/>
                  (p ≥ α) AND (mismatch ≤ 15%)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
