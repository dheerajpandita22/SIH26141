import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export function Collapsible({ title, children, defaultOpen = false, icon }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-800 transition duration-200"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-slate-200">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-400" />
        )}
      </button>
      {isOpen && <div className="p-4 border-t border-slate-700 bg-slate-900/50">{children}</div>}
    </div>
  );
}
