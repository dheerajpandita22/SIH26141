import React from 'react';
import { Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Verdict } from '../types/simulation';

interface StatusBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ verdict, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const baseClasses = `rounded-full font-semibold flex items-center gap-2 ${sizeClasses[size]}`;

  switch (verdict) {
    case 'LEGITIMATE':
      return (
        <div className={`${baseClasses} bg-green-900/30 text-green-300 border border-green-500/30`}>
          <CheckCircle size={size === 'lg' ? 20 : 16} />
          LEGITIMATE
        </div>
      );
    case 'FLAGGED':
      return (
        <div className={`${baseClasses} bg-red-900/30 text-red-300 border border-red-500/30`}>
          <AlertCircle size={size === 'lg' ? 20 : 16} />
          FLAGGED
        </div>
      );
    case 'ANALYZING':
      return (
        <div className={`${baseClasses} bg-yellow-900/30 text-yellow-300 border border-yellow-500/30 animate-pulse`}>
          <Clock size={size === 'lg' ? 20 : 16} />
          ANALYZING
        </div>
      );
  }
}

interface VerdictCardProps {
  verdict: Verdict;
  reason?: string;
}

export function VerdictCard({ verdict, reason }: VerdictCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-300">VERDICT</h3>
        <StatusBadge verdict={verdict} size="lg" />
      </div>
      {reason && (
        <p className="text-slate-400 text-sm leading-relaxed">
          {reason}
        </p>
      )}
    </div>
  );
}
