import { Wrench, Plus } from 'lucide-react';

interface HeaderProps {
  ticketCount: number;
  onNewRepair: () => void;
}

export default function Header({ ticketCount, onNewRepair }: HeaderProps) {
  return (
    <header className="py-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Wrench className="size-8 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">Repair Tracker</h1>
          <p className="text-slate-500 font-medium">
            {ticketCount} ticket{ticketCount !== 1 && 's'}
          </p>
        </div>
      </div>
      <button
        className="group relative inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 active:scale-[0.97]"
        onClick={onNewRepair}
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-violet-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="relative inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-violet-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-500">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="sm:inline">New Repair</span>
        </div>
      </button>
    </header>
  );
}
