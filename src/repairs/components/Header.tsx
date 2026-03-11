import { DollarSign, LogOut, Plus } from 'lucide-react';

import Logo from '@/site/components/Logo';

interface HeaderProps {
  ticketCount: number;
  onNewRepair: () => void;
  onPricing: () => void;
  onSignOut: () => void;
}

export default function Header({ ticketCount, onNewRepair, onPricing, onSignOut }: HeaderProps) {
  return (
    <header className="py-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Logo className="h-16 sm:h-18 w-auto" color="#cbd5e1" />
        <p className="text-slate-500 font-medium text-xs sm:text-base whitespace-nowrap">
          {ticketCount} ticket{ticketCount !== 1 && 's'}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium text-yellow-400 border border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all duration-200 active:scale-[0.97]"
          onClick={onPricing}
        >
          <DollarSign className="w-4 h-4" />
          <span className="hidden sm:inline">Buy Rates</span>
        </button>
        <button
          className="group relative inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 active:scale-[0.97]"
          onClick={onNewRepair}
        >
          <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-violet-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="relative inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-violet-600 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-500">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            <span>New Repair</span>
          </div>
        </button>
        <button
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-slate-700/40 hover:border-red-500/30 transition-all duration-200"
          onClick={onSignOut}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
