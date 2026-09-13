import { Play } from 'lucide-react';

interface RunButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function RunButton({ onClick, isLoading = false, disabled = false }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100"
    >
      <Play size={20} />
      {isLoading ? 'RUNNING SIMULATION...' : 'RUN SIMULATION'}
    </button>
  );
}
