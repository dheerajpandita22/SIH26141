import type { ConfusionMatrixData } from '../types/simulation';

interface ConfusionMatrixProps {
  data: ConfusionMatrixData;
}

export function ConfusionMatrix({ data }: ConfusionMatrixProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6">Confusion Matrix</h3>
      
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="px-4 py-2 text-left text-slate-300 font-semibold"></th>
              <th className="px-4 py-2 text-center text-slate-300 font-semibold bg-slate-800/50">Predicted Legitimate</th>
              <th className="px-4 py-2 text-center text-slate-300 font-semibold bg-slate-800/50">Predicted Attack</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700">
              <td className="px-4 py-2 text-slate-300 font-semibold bg-slate-800/50">Actual Legitimate</td>
              <td className="px-4 py-2 text-center text-green-400 font-bold bg-green-900/20 border border-green-700/50">{data.tn}</td>
              <td className="px-4 py-2 text-center text-red-400 font-bold bg-red-900/20 border border-red-700/50">{data.fp}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-slate-300 font-semibold bg-slate-800/50">Actual Attack</td>
              <td className="px-4 py-2 text-center text-red-400 font-bold bg-red-900/20 border border-red-700/50">{data.fn}</td>
              <td className="px-4 py-2 text-center text-green-400 font-bold bg-green-900/20 border border-green-700/50">{data.tp}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Accuracy" value={data.accuracy} />
        <MetricCard label="Precision" value={data.precision} />
        <MetricCard label="Recall" value={data.recall} />
        <MetricCard label="F1 Score" value={data.f1Score} />
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: number;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-cyan-400">{(value * 100).toFixed(2)}%</p>
    </div>
  );
}
