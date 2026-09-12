import React from 'react';
import { Atom, BarChart3, Shield, Zap } from 'lucide-react';

interface LandingHeroProps {
  onLaunchSimulation: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchSimulation }) => {
  return (
    <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-300 text-sm mb-8 font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Simulation — classical probabilistic model of the quantum protocol
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Quantum Signature
          </span>
          <br />
          <span className="text-slate-100">Threat Detection</span>
        </h1>
        
        <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Interactive simulation of quantum teleportation-based signature verification and statistical attack detection.
        </p>
        
        <button
          onClick={onLaunchSimulation}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
        >
          Launch Simulation →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 relative z-10">
        {[
          {
            icon: <Atom className="w-6 h-6 text-cyan-400" />,
            title: "Quantum Teleportation",
            desc: "3-qubit Bell-state teleportation protocol"
          },
          {
            icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
            title: "Multi-Basis Measurement",
            desc: "X, Y, Z basis measurement analysis"
          },
          {
            icon: <Shield className="w-6 h-6 text-green-400" />,
            title: "Threat Detection",
            desc: "Chi-square statistical verification"
          },
          {
            icon: <Zap className="w-6 h-6 text-red-400" />,
            title: "Attack Simulation",
            desc: "Forgery, impersonation, replay & channel attacks"
          }
        ].map((feature, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center mb-4 border border-white/5">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
