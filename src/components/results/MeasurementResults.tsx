import React from 'react';
import { SimulationResult } from '../../types/simulation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface MeasurementResultsProps {
  result: SimulationResult | null;
}

const MeasurementResults: React.FC<MeasurementResultsProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px]">
        <BarChart className="text-slate-600 mb-4" />
        <h3 className="text-xl font-bold text-slate-400">MEASUREMENT RESULTS</h3>
        <p className="text-slate-500 mt-2">Run a simulation to view quantum measurements</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {result.basisResults.map((basisResult, idx) => {
        const data = [
          {
            name: '|0⟩ State',
            Expected: parseFloat((basisResult.expected.p0 * 100).toFixed(1)),
            Observed: parseFloat((basisResult.observed.p0 * 100).toFixed(1))
          },
          {
            name: '|1⟩ State',
            Expected: parseFloat((basisResult.expected.p1 * 100).toFixed(1)),
            Observed: parseFloat((basisResult.observed.p1 * 100).toFixed(1))
          }
        ];

        return (
          <div key={idx} className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400">
                Measurement Results (Basis: {basisResult.basis})
              </h3>
              <div className="bg-slate-800 px-3 py-1 rounded-full text-sm text-slate-300 border border-slate-700">
                {basisResult.shots} shots
              </div>
            </div>

            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="Expected" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    <LabelList dataKey="Expected" position="top" fill="#cbd5e1" formatter={(val: number) => `${val}%`} />
                  </Bar>
                  <Bar dataKey="Observed" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    <LabelList dataKey="Observed" position="top" fill="#cbd5e1" formatter={(val: number) => `${val}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <div className="text-cyan-400 font-bold mb-2 pb-2 border-b border-slate-700/50">|0⟩ Probability</div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Expected:</span>
                  <span className="text-white">{(basisResult.expected.p0 * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Observed:</span>
                  <span className="text-white">{(basisResult.observed.p0 * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Mismatch:</span>
                  <span className={`${Math.abs(basisResult.expected.p0 - basisResult.observed.p0) > basisResult.detector.mismatchThreshold ? 'text-red-400' : 'text-slate-300'}`}>
                    {(Math.abs(basisResult.expected.p0 - basisResult.observed.p0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <div className="text-purple-400 font-bold mb-2 pb-2 border-b border-slate-700/50">|1⟩ Probability</div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Expected:</span>
                  <span className="text-white">{(basisResult.expected.p1 * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Observed:</span>
                  <span className="text-white">{(basisResult.observed.p1 * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Mismatch:</span>
                  <span className={`${Math.abs(basisResult.expected.p1 - basisResult.observed.p1) > basisResult.detector.mismatchThreshold ? 'text-red-400' : 'text-slate-300'}`}>
                    {(Math.abs(basisResult.expected.p1 - basisResult.observed.p1) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MeasurementResults;
