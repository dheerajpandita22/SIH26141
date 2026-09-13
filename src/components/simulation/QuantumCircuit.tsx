import React from 'react';
import type { SimulationStage } from '../../types/simulation';

interface QuantumCircuitProps {
  theta: number;
  stage: SimulationStage;
}

const QuantumCircuit: React.FC<QuantumCircuitProps> = ({ theta, stage }) => {
  // Determine if gates are active based on the simulation stage
  const isPreparing = stage === 'preparing' || stage === 'complete';
  const isBellPair = stage === 'bell-pair' || stage === 'complete';
  const isTeleporting = stage === 'teleporting' || stage === 'complete';
  const isChannel = stage === 'channel' || stage === 'complete';
  const isMeasuring = stage === 'measuring' || stage === 'detecting' || stage === 'complete';

  // Helper to determine wire active state
  const isWireActive = (wireStage: boolean) => wireStage ? 'circuit-wire-active' : '';
  const isGateActive = (gateStage: boolean) => gateStage ? 'circuit-gate-active' : '';

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4 text-cyan-400">Quantum Teleportation Circuit</h3>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 800 280"
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          className="font-mono text-sm"
        >
          {/* Wire Backgrounds */}
          <line x1="200" y1="60" x2="750" y2="60" className={`circuit-wire ${isWireActive(true)}`} />
          <line x1="200" y1="140" x2="750" y2="140" className={`circuit-wire ${isWireActive(isBellPair)}`} />
          <line x1="200" y1="220" x2="750" y2="220" className={`circuit-wire ${isWireActive(isChannel)}`} />

          {/* Labels */}
          <text x="10" y="65" fill="#e2e8f0" className="font-semibold">Q0 — Signature/Alice</text>
          <text x="10" y="145" fill="#e2e8f0" className="font-semibold">Q1 — Bell Qubit</text>
          <text x="10" y="225" fill="#e2e8f0" className="font-semibold">Q2 — Bob/Receiver</text>

          {/* Q0 Gate: RY */}
          <g transform="translate(230, 40)">
            <rect width="60" height="40" rx="4" className={`circuit-gate ${isGateActive(isPreparing)}`} />
            <text x="30" y="25" textAnchor="middle" className="circuit-gate-text text-xs">
              RY({theta.toFixed(2)})
            </text>
          </g>

          {/* Q1 Gate: H (Bell pair creation) */}
          <g transform="translate(230, 120)">
            <rect width="40" height="40" rx="4" className={`circuit-gate ${isGateActive(isBellPair)}`} />
            <text x="20" y="25" textAnchor="middle" className="circuit-gate-text">H</text>
          </g>

          {/* Q1 -> Q2 CNOT (Bell pair creation) */}
          <line x1="310" y1="140" x2="310" y2="220" className={`circuit-wire ${isWireActive(isBellPair)}`} />
          <circle cx="310" cy="140" r="5" fill={isBellPair ? '#06b6d4' : '#64748b'} />
          <circle cx="310" cy="220" r="15" className={`circuit-measurement ${isGateActive(isBellPair)}`} />
          <text x="310" y="225" textAnchor="middle" fill={isBellPair ? '#0a0f1a' : '#cbd5e1'} fontSize="18">⊕</text>

          {/* Q0 -> Q1 CNOT (Teleportation) */}
          <line x1="400" y1="60" x2="400" y2="140" className={`circuit-wire ${isWireActive(isTeleporting)}`} />
          <circle cx="400" cy="60" r="5" fill={isTeleporting ? '#06b6d4' : '#64748b'} />
          <circle cx="400" cy="140" r="15" className={`circuit-measurement ${isGateActive(isTeleporting)}`} />
          <text x="400" y="145" textAnchor="middle" fill={isTeleporting ? '#0a0f1a' : '#cbd5e1'} fontSize="18">⊕</text>

          {/* Q0 Gate: H (Teleportation) */}
          <g transform="translate(450, 40)">
            <rect width="40" height="40" rx="4" className={`circuit-gate ${isGateActive(isTeleporting)}`} />
            <text x="20" y="25" textAnchor="middle" className="circuit-gate-text">H</text>
          </g>

          {/* Measurement on Q0 */}
          <g transform="translate(520, 40)">
            <rect width="40" height="40" rx="4" className={`circuit-measurement ${isGateActive(isTeleporting)}`} />
            <path d="M 10,30 Q 20,10 30,30" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="30" x2="25" y2="15" stroke="currentColor" strokeWidth="2" />
          </g>

          {/* Measurement on Q1 */}
          <g transform="translate(520, 120)">
            <rect width="40" height="40" rx="4" className={`circuit-measurement ${isGateActive(isTeleporting)}`} />
            <path d="M 10,30 Q 20,10 30,30" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="30" x2="25" y2="15" stroke="currentColor" strokeWidth="2" />
          </g>

          {/* Classical communication / Corrections (represented abstractly) */}
          <line x1="540" y1="80" x2="540" y2="220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" className={isChannel ? 'opacity-100' : 'opacity-20'} />
          <line x1="540" y1="160" x2="540" y2="220" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4,4" className={isChannel ? 'opacity-100' : 'opacity-20'} />
          
          <g transform="translate(580, 200)">
            <rect width="40" height="40" rx="4" className={`circuit-gate ${isGateActive(isChannel)}`} />
            <text x="20" y="25" textAnchor="middle" className="circuit-gate-text">X/Z</text>
          </g>

          {/* Final Measurement on Q2 */}
          <g transform="translate(680, 200)">
            <rect width="40" height="40" rx="4" className={`circuit-measurement ${isGateActive(isMeasuring)}`} />
            <path d="M 10,30 Q 20,10 30,30" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="20" y1="30" x2="25" y2="15" stroke="currentColor" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default QuantumCircuit;
