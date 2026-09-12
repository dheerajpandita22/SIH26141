import React from 'react';
import { SimulationStage } from '../../types/simulation';
import { Play, RotateCcw, Loader2 } from 'lucide-react';

interface SimulationRunnerProps {
  stage: SimulationStage;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
}

const SimulationRunner: React.FC<SimulationRunnerProps> = ({ stage, isRunning, onRun, onReset }) => {
  const stages: { id: SimulationStage; label: string }[] = [
    { id: 'preparing', label: 'Prepare' },
    { id: 'bell-pair', label: 'Bell Pair' },
    { id: 'teleporting', label: 'Teleport' },
    { id: 'channel', label: 'Channel' },
    { id: 'attacking', label: 'Attack' },
    { id: 'measuring', label: 'Measure' },
    { id: 'comparing', label: 'Compare' },
    { id: 'detecting', label: 'Detect' },
    { id: 'complete', label: 'Complete' }
  ];

  const stageOrder = ['idle', ...stages.map(s => s.id)];
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="glass-card p-6 flex flex-col items-center w-full">
      <div className="flex flex-row gap-4 mb-8">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300
            ${isRunning 
              ? 'bg-slate-800 text-cyan-700 cursor-not-allowed' 
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse-glow'
            }`}
        >
          {isRunning ? <Loader2 className="animate-spin" size={24} /> : <Play size={24} />}
          {isRunning ? 'Running...' : 'Run Simulation'}
        </button>
        
        <button
          onClick={onReset}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-4 rounded-lg font-bold text-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw size={24} />
          Reset
        </button>
      </div>

      <div className="w-full hidden md:block">
        <div className="flex items-center justify-between relative px-4">
          <div className="absolute left-8 right-8 top-1/2 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute left-8 top-1/2 h-1 bg-cyan-500 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `calc(${(Math.max(0, currentIndex - 1) / (stages.length - 1)) * 100}% - 4rem)` }}
          />
          
          {stages.map((s, idx) => {
            const stepIndex = stageOrder.indexOf(s.id);
            const isComplete = currentIndex >= stepIndex;
            const isActive = currentIndex === stepIndex;

            let dotClass = "w-6 h-6 rounded-full z-10 border-2 transition-all duration-300 ";
            if (isActive) dotClass += "bg-cyan-500 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]";
            else if (isComplete) dotClass += "bg-cyan-700 border-cyan-500";
            else dotClass += "bg-slate-900 border-slate-700";

            return (
              <div key={s.id} className="flex flex-col items-center gap-2 z-10 w-20">
                <div className={dotClass} />
                <span className={`text-xs font-semibold text-center transition-colors duration-300 ${isActive ? 'text-cyan-400' : isComplete ? 'text-cyan-700' : 'text-slate-600'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 md:hidden">
        {stages.map((s, idx) => {
          const stepIndex = stageOrder.indexOf(s.id);
          const isComplete = currentIndex >= stepIndex;
          const isActive = currentIndex === stepIndex;

          if (!isComplete && !isActive && idx !== 0) return null; // Show only active, completed or first in mobile

          return (
            <div key={s.id} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'bg-cyan-500 border-cyan-300' : isComplete ? 'bg-cyan-700 border-cyan-500' : 'bg-slate-900 border-slate-700'}`} />
              <span className={`text-sm font-semibold ${isActive ? 'text-cyan-400' : isComplete ? 'text-cyan-700' : 'text-slate-600'}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimulationRunner;
