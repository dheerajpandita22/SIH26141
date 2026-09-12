import React from 'react';
import { Copy, Download } from 'lucide-react';

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportJSON: () => void;
}

export function ExportButtons({ onExportCSV, onExportJSON }: ExportButtonsProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onExportCSV}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition duration-200"
      >
        <Download size={18} />
        Export CSV
      </button>
      <button
        onClick={onExportJSON}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition duration-200"
      >
        <Download size={18} />
        Export JSON
      </button>
    </div>
  );
}
