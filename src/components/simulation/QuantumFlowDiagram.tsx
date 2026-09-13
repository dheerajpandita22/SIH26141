import React from 'react';
import type { SimulationStage, AttackType } from '../../types/simulation';
import { 
  User, 
  FileCode2, 
  Link2, 
  Zap, 
  Radio, 
  AlertTriangle, 
  BarChart, 
  ShieldCheck, 
  CheckCircle,
  XCircle,
  ArrowDown
} from 'lucide-react';

interface QuantumFlowDiagramProps {
  stage: SimulationStage;
  attack: AttackType;
}

const QuantumFlowDiagram: React.FC<QuantumFlowDiagramProps> = ({ stage, attack }) => {
  const stageOrder = [
    'idle',
    'preparing',
    'bell-pair',
    'teleporting',
    'channel',
    'attacking',
    'measuring',
    'detecting',
    'complete'
  ];

  const currentIndex = stageOrder.indexOf(stage);

  const isComplete = (stepIndex: number) => currentIndex >= stepIndex;
  const isActive = (stepIndex: number) => currentIndex === stepIndex;

  const steps = [
    { label: 'SIGNER', icon: User, matchIndex: 1 },
    { label: 'Signature State', icon: FileCode2, matchIndex: 1 },
    { label: 'Bell Pair', icon: Link2, matchIndex: 2 },
    { label: 'Quantum Teleportation', icon: Zap, matchIndex: 3 },
    { label: 'Channel', icon: Radio, matchIndex: 4 },
    { 
      label: attack !== 'none' ? `Attack: ${attack.toUpperCase()}` : 'No Attack', 
      icon: attack !== 'none' ? AlertTriangle : CheckCircle, 
      matchIndex: 5,
      isAttack: attack !== 'none'
    },
    { label: 'Bob / Receiver', icon: User, matchIndex: 6 },
    { label: 'Measurement', icon: BarChart, matchIndex: 6 },
    { label: 'Threat Detector', icon: ShieldCheck, matchIndex: 7 },
    { label: 'Verdict', icon: attack !== 'none' ? XCircle : CheckCircle, matchIndex: 8 }
  ];

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-6 text-cyan-400">Simulation Flow</h3>
      
      <div className="flex flex-col items-center w-full max-w-[200px]">
        {steps.map((step, index) => {
          const stepComplete = isComplete(step.matchIndex);
          const stepActive = isActive(step.matchIndex);
          
          let nodeClass = "flow-node border-2 flex items-center justify-center rounded-full w-12 h-12 z-10 bg-slate-900 transition-all duration-300 ";
          let textClass = "mt-2 text-sm font-semibold text-center transition-all duration-300 ";
          
          if (stepActive) {
            nodeClass += step.isAttack ? "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]";
            textClass += step.isAttack ? "text-red-400" : "text-cyan-400";
          } else if (stepComplete) {
            nodeClass += step.isAttack ? "border-red-500 bg-red-900/20 text-red-400" : "border-green-500 bg-green-900/20 text-green-400";
            textClass += step.isAttack ? "text-red-500" : "text-green-500";
          } else {
            nodeClass += "border-slate-700 text-slate-500";
            textClass += "text-slate-500";
          }

          const Icon = step.icon;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={nodeClass}>
                  <Icon size={24} />
                </div>
                <span className={textClass}>{step.label}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`my-2 flex flex-col items-center transition-all duration-300 ${isComplete(steps[index + 1].matchIndex) ? (step.isAttack ? 'text-red-500' : 'text-cyan-500') : 'text-slate-700'}`}>
                  <ArrowDown size={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default QuantumFlowDiagram;
