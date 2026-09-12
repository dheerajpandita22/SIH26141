import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const steps = [
    "Alice prepares a quantum signature using secret angle θ",
    "The state is encoded as an RY(θ) rotation: |ψ⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩",
    "Alice and Bob establish a Bell pair (entangled qubits)",
    "The signature state is teleported to Bob via quantum teleportation",
    "The verifier measures the received state in X, Y, and Z bases",
    "Measurements are compared with theoretical probabilities for the expected θ",
    "A chi-square goodness-of-fit test determines statistical consistency",
    "The system returns LEGITIMATE or FLAGGED based on statistical thresholds"
  ];

  return (
    <div className="glass-card border border-cyan-900/30 rounded-xl overflow-hidden bg-[#0c1220]/80">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-slate-100">How It Works</h2>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-2">
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 p-3 rounded-lg ${idx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
