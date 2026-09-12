import React from 'react';

interface BlochSphereProps {
  theta: number;
}

const BlochSphere: React.FC<BlochSphereProps> = ({ theta }) => {
  const radius = 90;
  const cx = 120;
  const cy = 120;

  // Arrow endpoint
  const x = cx + radius * Math.sin(theta);
  const y = cy - radius * Math.cos(theta);

  // Probabilities
  const p0 = Math.cos(theta / 2) ** 2;
  const p1 = Math.sin(theta / 2) ** 2;

  // Arc path for theta
  const arcRadius = 30;
  const arcX = cx + arcRadius * Math.sin(theta);
  const arcY = cy - arcRadius * Math.cos(theta);
  const largeArcFlag = theta > Math.PI ? 1 : 0;
  const arcPath = `M ${cx} ${cy - arcRadius} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${arcX} ${arcY}`;

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 text-cyan-400">Quantum State Visualization</h3>
      
      <svg
        viewBox="0 0 240 280"
        width="100%"
        height="100%"
        className="font-mono bloch-sphere"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" />
          </marker>
        </defs>

        {/* Axes */}
        <line x1={cx} y1={cy - radius - 15} x2={cx} y2={cy + radius + 15} className="bloch-axis stroke-slate-500 stroke-dasharray-4" strokeDasharray="4,4" strokeWidth="1" />
        <line x1={cx - radius - 15} y1={cy} x2={cx + radius + 15} y2={cy} className="bloch-axis stroke-slate-500 stroke-dasharray-4" strokeDasharray="4,4" strokeWidth="1" />

        {/* Sphere Circle */}
        <circle cx={cx} cy={cy} r={radius} className="bloch-circle fill-none stroke-slate-400 strokeWidth-2 opacity-50" />

        {/* Labels */}
        <text x={cx} y={cy - radius - 20} textAnchor="middle" fill="#e2e8f0" fontSize="14">|0⟩</text>
        <text x={cx} y={cy + radius + 30} textAnchor="middle" fill="#e2e8f0" fontSize="14">|1⟩</text>
        <text x={cx + radius + 25} y={cy + 5} textAnchor="middle" fill="#e2e8f0" fontSize="14">|+⟩</text>
        <text x={cx - radius - 25} y={cy + 5} textAnchor="middle" fill="#e2e8f0" fontSize="14">|-⟩</text>

        {/* Angle Arc */}
        {theta > 0 && (
          <path d={arcPath} fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.7" />
        )}
        {theta > 0 && (
          <text x={cx + 15} y={cy - 15} fill="#8b5cf6" fontSize="12">θ</text>
        )}

        {/* State Vector */}
        <line
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          className="bloch-arrow stroke-cyan-400"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
          style={{ transition: 'all 0.5s ease-in-out' }}
        />

        {/* Equation */}
        <text x={cx} y={240} textAnchor="middle" fill="#e2e8f0" fontSize="14">
          |ψ⟩ = {Math.cos(theta / 2).toFixed(3)}|0⟩ + {Math.sin(theta / 2).toFixed(3)}|1⟩
        </text>

        {/* Probabilities Bars */}
        <g transform={`translate(${cx - 80}, 260)`}>
          <text x="0" y="10" fill="#e2e8f0" fontSize="10">P(|0⟩)</text>
          <rect x="35" y="2" height="8" width={p0 * 100} fill="#06b6d4" rx="2" />
          <text x={140} y="10" fill="#06b6d4" fontSize="10">{(p0 * 100).toFixed(1)}%</text>
        </g>
        <g transform={`translate(${cx - 80}, 275)`}>
          <text x="0" y="10" fill="#e2e8f0" fontSize="10">P(|1⟩)</text>
          <rect x="35" y="2" height="8" width={p1 * 100} fill="#8b5cf6" rx="2" />
          <text x={140} y="10" fill="#8b5cf6" fontSize="10">{(p1 * 100).toFixed(1)}%</text>
        </g>
      </svg>
    </div>
  );
};

export default BlochSphere;
