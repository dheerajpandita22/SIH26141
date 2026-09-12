import React from 'react';
import { BookOpen } from 'lucide-react';
import { Collapsible } from './Collapsible';

export function HowItWorks() {
  return (
    <div className="space-y-4">
      <Collapsible
        title="How It Works"
        defaultOpen={true}
        icon={<BookOpen size={20} className="text-cyan-400" />}
      >
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-slate-200 mb-2">1. Quantum Signature Preparation</h4>
            <p>
              Alice prepares a quantum state based on a secret rotation angle θ using the rotation gate:
            </p>
            <p className="font-mono text-cyan-400 mt-1">RY(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">2. Bell Pair Entanglement</h4>
            <p>
              Alice and Bob establish an entangled Bell pair to enable quantum teleportation of the signature qubit.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">3. Quantum Teleportation</h4>
            <p>
              Alice performs a Bell measurement on the signature qubit and her half of the Bell pair, then sends the classical results to Bob.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">4. Channel Transmission</h4>
            <p>
              The quantum state is transmitted through a quantum channel where attacks may occur (bit flips, tampering, etc.).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">5. Measurement in Multiple Bases</h4>
            <p>
              Bob receives the qubit and measures it in one or more of the three bases:
            </p>
            <ul className="mt-1 space-y-1 ml-4">
              <li>• <strong>Z basis:</strong> P(0) = cos²(θ/2)</li>
              <li>• <strong>X basis:</strong> P(0) = 0.5(1 + sin θ)</li>
              <li>• <strong>Y basis:</strong> P(0) = 0.5</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">6. Statistical Verification</h4>
            <p>
              Observed measurement outcomes are compared against theoretical expectations using a chi-square goodness-of-fit test.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">7. Threat Detection</h4>
            <p>
              The system applies detection rules:
            </p>
            <ul className="mt-1 space-y-1 ml-4">
              <li>• <strong>LEGITIMATE:</strong> p-value ≥ 0.05 AND mismatch rate ≤ 15%</li>
              <li>• <strong>FLAGGED:</strong> otherwise (possible attack detected)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 mb-2">8. Attack Types</h4>
            <ul className="mt-1 space-y-1 ml-4">
              <li>• <strong>Forgery:</strong> Attacker guesses wrong θ</li>
              <li>• <strong>Impersonation:</strong> Attacker sends |+⟩ instead of legitimate state</li>
              <li>• <strong>Channel Manipulation:</strong> Bit-flip disturbance in transit</li>
              <li>• <strong>Replay:</strong> Reuse of old session (requires nonce/session validation)</li>
            </ul>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
