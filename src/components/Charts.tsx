import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { MeasurementResult, Basis } from '../types/simulation';

interface MeasurementChartProps {
  measurements: MeasurementResult[];
  title?: string;
}

export function MeasurementChart({ measurements, title = 'Measurement Results' }: MeasurementChartProps) {
  const data = useMemo(() => {
    return measurements.map((m) => ({
      basis: m.basis,
      expected0: (m.expected0 * 100).toFixed(1),
      observed0: (m.observed0 / m.shots * 100).toFixed(1),
      expected1: (m.expected1 * 100).toFixed(1),
      observed1: (m.observed1 / m.shots * 100).toFixed(1),
    }));
  }, [measurements]);

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="basis" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <Legend />
          <Bar dataKey="expected0" fill="#06b6d4" name="Expected 0" />
          <Bar dataKey="observed0" fill="#0891b2" name="Observed 0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ProbabilityDistributionProps {
  expected0: number;
  observed0: number;
  shots: number;
  basis: Basis;
}

export function ProbabilityDistribution({ expected0, observed0, shots, basis }: ProbabilityDistributionProps) {
  const data = [
    {
      name: 'Expected 0',
      value: Number((expected0 * 100).toFixed(1)),
    },
    {
      name: 'Observed 0',
      value: Number(((observed0 / shots) * 100).toFixed(1)),
    },
  ];

  const COLORS = ['#06b6d4', '#0891b2'];

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">{basis} Basis Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DetectionRateChartProps {
  data: Array<{ name: string; rate: number }>;
}

export function DetectionRateChart({ data }: DetectionRateChartProps) {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Detection Rate by Attack Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
          <Bar dataKey="rate" fill="#ef4444" name="Detection Rate" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
