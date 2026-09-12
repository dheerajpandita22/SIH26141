import React from 'react';
import { SimulationResult } from '../../types/simulation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface MultiBasisResultsProps {
  result: SimulationResult | null;
}

const MultiBasisResults: React.FC<MultiBasisResultsProps> = ({ result }) => {
  if (!result || result.basisResults.length <= 1) {
    return null;
  }

  const chartData = result.basisResults.map((br) => ({
    name: `Basis ${br.basis}`,
    'Expected |0⟩': parseFloat((br.expected.p0 * 100).toFixed(1)),
    'Observed |0⟩': parseFloat((br.observed.p0 * 100).toFixed(1)),
    'Expected |1⟩': parseFloat((br.expected.p1 * 100).toFixed(1)),
    'Observed |1⟩': parseFloat((br.observed.p1 * 100).toFixed(1)),
  }));

  return (
    <div className="glass-card p-6 mt-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-700 pb-2">Multi-Basis Analysis</h3>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-800 text-slate-300">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Basis</th>
              <th className="px-4 py-3">Exp |0⟩</th>
              <th className="px-4 py-3">Obs |0⟩</th>
              <th className="px-4 py-3">Exp |1⟩</th>
              <th className="px-4 py-3">Obs |1⟩</th>
              <th className="px-4 py-3">Mismatch</th>
              <th className="px-4 py-3 rounded-tr-lg">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {result.basisResults.map((br, idx) => {
              const mismatch = Math.abs(br.expected.p0 - br.observed.p0);
              const isLegitimate = br.detector.verdict === 'LEGITIMATE';
              
              return (
                <tr key={idx} className="border-b border-slate-700 font-mono bg-slate-900/30">
                  <td className="px-4 py-3 font-bold text-white">{br.basis}</td>
                  <td className="px-4 py-3 text-cyan-400">{(br.expected.p0 * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-purple-400">{(br.observed.p0 * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-cyan-400">{(br.expected.p1 * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-purple-400">{(br.observed.p1 * 100).toFixed(1)}%</td>
                  <td className={`px-4 py-3 ${mismatch > br.detector.mismatchThreshold ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                    {(mismatch * 100).toFixed(1)}%
                  </td>
                  <td className={`px-4 py-3 font-bold ${isLegitimate ? 'text-green-500 bg-green-950/30' : 'text-red-500 bg-red-950/30'}`}>
                    {br.detector.verdict}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="h-80 w-full">
        <h4 className="text-sm font-bold text-slate-400 mb-4 text-center">Probability Distribution Across Bases (|0⟩ State)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
            <Bar dataKey="Expected |0⟩" fill="#06b6d4" radius={[4, 4, 0, 0]} maxBarSize={40}>
              <LabelList dataKey="Expected |0⟩" position="top" fill="#cbd5e1" formatter={(val: number) => `${val}%`} />
            </Bar>
            <Bar dataKey="Observed |0⟩" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40}>
              <LabelList dataKey="Observed |0⟩" position="top" fill="#cbd5e1" formatter={(val: number) => `${val}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiBasisResults;
