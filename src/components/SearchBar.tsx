import { Search, X } from 'lucide-react';

import { Status } from '@/types';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterStatus: Status | 'all';
  onClear: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function SearchBar({
  search,
  onSearchChange,
  filterStatus,
  onClear,
  filteredCount,
  totalCount
}: SearchBarProps) {
  const hasFilters = filterStatus !== 'all' || search;

  return (
    <div className="pb-4 flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          className="w-full bg-slate-800/60 border border-slate-600/30 text-slate-100 pl-10 pr-4 py-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all duration-200 hover:border-slate-500/40 shadow-sm shadow-black/20"
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search tickets..."
          type="text"
          value={search}
        />
      </div>
      {hasFilters && (
        <button
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200"
          onClick={onClear}
        >
          <X className="w-3 h-3" />
          Clear
        </button>
      )}
      {filteredCount !== totalCount && (
        <span className="text-xs text-slate-600 font-medium tabular-nums">
          {filteredCount} of {totalCount}
        </span>
      )}
    </div>
  );
}
