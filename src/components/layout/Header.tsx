import React from 'react';
import { Atom, Play } from 'lucide-react';
import { AppTab } from '../../types/simulation';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isDemoMode: boolean;
  onToggleDemo: () => void;
}

const TABS: { id: AppTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'attacks', label: 'Attack Lab' },
  { id: 'batch', label: 'Batch Analysis' },
  { id: 'history', label: 'History' },
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, isDemoMode, onToggleDemo }) => {
  return (
    <header className="bg-[#0c1220] border-b border-cyan-900/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Atom className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:block">
            Quantum Signature Threat Detection
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center">
          <button
            onClick={onToggleDemo}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isDemoMode
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Play className={`w-4 h-4 ${isDemoMode ? 'text-purple-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isDemoMode ? 'Demo Active' : 'Demo Mode'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile nav scrollable */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-white/5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
