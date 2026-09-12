import React from 'react';
import { Zap, Radio, AlertTriangle, BarChart3 } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white">
      {/* Background grid effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(6, 182, 212, 0.5) 25%, rgba(6, 182, 212, 0.5) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.5) 75%, rgba(6, 182, 212, 0.5) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(6, 182, 212, 0.5) 25%, rgba(6, 182, 212, 0.5) 26%, transparent 27%, transparent 74%, rgba(6, 182, 212, 0.5) 75%, rgba(6, 182, 212, 0.5) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-10 h-10 text-cyan-400" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Quantum Signature
              </h1>
            </div>
            <p className="text-3xl md:text-4xl font-bold text-slate-300 mb-4">
              Threat Detection
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Interactive simulation of quantum teleportation-based signature verification and statistical attack detection.
            </p>
            <p className="text-sm text-slate-500 mt-3">
              <em>Simulation — classical probabilistic model of the quantum protocol</em>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Quantum Teleportation"
              description="Simulate Bell pair entanglement and quantum state transfer"
            />
            <FeatureCard
              icon={<Radio className="w-8 h-8" />}
              title="Multi-Basis Measurement"
              description="Measure in X, Y, and Z bases with statistical analysis"
            />
            <FeatureCard
              icon={<AlertTriangle className="w-8 h-8" />}
              title="Threat Detection"
              description="Chi-square goodness-of-fit testing and statistical verification"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Attack Simulation"
              description="Forgery, impersonation, replay, and channel manipulation"
            />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={onStart}
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Launch Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition duration-300">
      <div className="text-cyan-400 mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-2 text-slate-200">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
