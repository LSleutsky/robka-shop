import { Search, Trash2, X } from 'lucide-react';

import { STATUS_CONFIG } from '@/config/statuses';
import { Status } from '@/types';

interface SearchBarProps {
  search: string;
  filterStatus: Status | 'all';
  selectedCount: number;
  allSelected: boolean;
  onSearchChange: (value: string) => void;
  onClearFilter: () => void;
  onRemoveSelected: () => void;
}

export default function SearchBar({
  search,
  filterStatus,
  selectedCount,
  allSelected,
  onSearchChange,
  onClearFilter,
  onRemoveSelected
}: SearchBarProps) {
  const removeLabel = allSelected ? 'Remove All' : selectedCount === 1 ? 'Remove Row' : 'Remove Rows';

  return (
    <div className="pb-4 flex items-center gap-3 flex-wrap">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          className={`w-full bg-slate-800/60 border border-slate-600/30 text-slate-100 pl-10 py-2.5 rounded-xl focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all duration-200 hover:border-slate-500/40 shadow-sm shadow-black/20 ${search ? 'pr-9' : 'pr-4'}`}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search tickets..."
          type="text"
          value={search}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
            onClick={() => onSearchChange('')}
          >
            <X className="size-6" />
          </button>
        )}
      </div>
      {filterStatus !== 'all' && (
        <button
          className={`inline-flex items-center gap-1.5 font-semibold px-3 py-2 text-sm rounded-lg ring-1 ring-inset transition-all duration-200 ${STATUS_CONFIG[filterStatus].bg} ${STATUS_CONFIG[filterStatus].text} ${STATUS_CONFIG[filterStatus].ring} hover:brightness-125`}
          onClick={onClearFilter}
        >
          {STATUS_CONFIG[filterStatus].label}
          <X className="size-4 mt-0.5" />
        </button>
      )}
      {selectedCount > 0 && (
        <button
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 ring-1 ring-red-500/20 transition-all duration-200"
          onClick={onRemoveSelected}
        >
          <Trash2 className="w-3 h-3" />
          {removeLabel}
        </button>
      )}
    </div>
  );
}
