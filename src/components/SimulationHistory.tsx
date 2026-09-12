import React from 'react';
import { SimulationRun } from '../types/simulation';
import { StatusBadge } from './StatusBadge';
import { radiansToDegrees } from '../simulation/quantumState';

interface SimulationHistoryProps {
  history: SimulationRun[];
  onClear: () => void;
}

export function SimulationHistory({ history, onClear }: SimulationHistoryProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-200">Simulation History</h3>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs px-3 py-1 bg-slate-700 hover:bg-red-700/30 text-slate-300 hover:text-red-300 rounded transition duration-200"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-slate-400 text-center py-8">No simulations run yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">θ (deg)</th>
                <th className="px-3 py-2 text-left">Basis</th>
                <th className="px-3 py-2 text-left">Shots</th>
                <th className="px-3 py-2 text-left">Attack</th>
                <th className="px-3 py-2 text-left">p-value</th>
                <th className="px-3 py-2 text-left">Mismatch</th>
                <th className="px-3 py-2 text-center">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 20).map((run, idx) => (
                <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                  <td className="px-3 py-2">{formatTime(run.timestamp)}</td>
                  <td className="px-3 py-2">{radiansToDegrees(run.theta).toFixed(1)}°</td>
                  <td className="px-3 py-2">{run.basis}</td>
                  <td className="px-3 py-2">{run.shots}</td>
                  <td className="px-3 py-2 capitalize">{run.attackType.replace('_', ' ')}</td>
                  <td className="px-3 py-2">{run.pValue.toFixed(4)}</td>
                  <td className="px-3 py-2">{(run.mismatchRate * 100).toFixed(2)}%</td>
                  <td className="px-3 py-2 text-center">
                    <StatusBadge verdict={run.verdict} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
