import { Zap, ArrowRight } from 'lucide-react';
import type { QuantumState } from '../types/simulation';
import { radiansToDegrees } from '../simulation/quantumState';

interface QuantumCircuitProps {
  quantumState: QuantumState;
  isAnimating?: boolean;
}

export function QuantumCircuit({ quantumState, isAnimating = false }: QuantumCircuitProps) {
  const theta = quantumState.theta;
  const thetaDeg = radiansToDegrees(theta);
  const state = `cos(${(theta / 2).toFixed(2)})|0⟩ + sin(${(theta / 2).toFixed(2)})|1⟩`;

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6">Quantum Circuit Diagram</h3>

      <div className="space-y-6 text-sm font-mono text-slate-300">
        {/* Signature Qubit - Q0 */}
        <div className="border-l-2 border-cyan-500/50 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-cyan-400 font-bold">Q0 (Signature/Alice)</span>
            {isAnimating && <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span>|0⟩</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-cyan-300">RY(θ)</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-green-300">H</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-purple-300">M</span>
            </div>
          </div>
        </div>

        {/* Bell Pair Qubit - Q1 */}
        <div className="border-l-2 border-blue-500/50 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-400 font-bold">Q1 (Bell/Alice)</span>
            {isAnimating && <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span>|0⟩</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-green-300">H</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-purple-300">M</span>
            </div>
          </div>
        </div>

        {/* Receiver Qubit - Q2 */}
        <div className="border-l-2 border-emerald-500/50 pl-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-emerald-400 font-bold">Q2 (Bob/Receiver)</span>
            {isAnimating && <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />}
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span>Bell State</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-green-300">CX/CZ</span>
              <ArrowRight size={16} className="text-slate-500" />
              <span className="text-purple-300">M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantum State Display */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Quantum State</h4>
        <div className="bg-slate-800/50 border border-slate-600 rounded p-3 text-xs">
          <p className="text-slate-300">θ = {thetaDeg.toFixed(2)}° ({theta.toFixed(4)} rad)</p>
          <p className="text-cyan-400 font-mono mt-2">|ψ⟩ = {state}</p>
        </div>
      </div>

      {/* Probability Display */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 border border-slate-600 rounded p-3">
          <p className="text-xs text-slate-400 mb-1">P(|0⟩)</p>
          <p className="text-xl font-bold text-green-400">{(quantumState.prob0 * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-600 rounded p-3">
          <p className="text-xs text-slate-400 mb-1">P(|1⟩)</p>
          <p className="text-xl font-bold text-red-400">{(quantumState.prob1 * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
}
