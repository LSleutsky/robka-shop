import { Pencil, Trash2, Loader2 } from 'lucide-react';

import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';

import { Repair, Status } from '@/types';

interface RepairTableProps {
  repairs: Repair[];
  filteredRepairs: Repair[];
  loading: boolean;
  selectedIds: Set<number>;
  onEdit: (repair: Repair) => void;
  onDelete: (id: number) => void;
  onToggleSelect: (id: number) => void;
  onToggleAll: () => void;
  onStatusChange: (id: number, status: Status) => void;
}

const COLUMNS = ['', 'Ticket', 'Date', 'Customer', 'Items', 'Specs', 'Status', ''];

export default function RepairTable({
  repairs,
  filteredRepairs,
  loading,
  selectedIds,
  onEdit,
  onDelete,
  onToggleSelect,
  onToggleAll,
  onStatusChange
}: RepairTableProps) {
  const allSelected = filteredRepairs.length > 0 && filteredRepairs.every(repair => selectedIds.has(repair.id));

  return (
    <div className="pb-8 mt-1">
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm shadow-lg shadow-black/20 overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-600">
            <Loader2 className="size-14 animate-spin text-blue-500/60 mb-3" />
            <p className="font-medium">Loading repairs...</p>
          </div>
        ) : filteredRepairs.length === 0 ? (
          <EmptyState hasRepairs={repairs.length > 0} />
        ) : (
          <table className="w-full text-sm">
            <colgroup>
              <col className="w-[3%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[17%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[12%]" />
              <col className="w-[6%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-700/30">
                {COLUMNS.map((column, index) =>
                  index === 0 ? (
                    <th key="checkbox" className="pl-5 pr-2 py-3.5">
                      <input
                        checked={allSelected}
                        className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0 cursor-pointer accent-blue-500"
                        onChange={onToggleAll}
                        type="checkbox"
                      />
                    </th>
                  ) : (
                    <th
                      key={column || 'actions'}
                      className="px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap"
                    >
                      {column}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRepairs.map(repair => {
                const selected = selectedIds.has(repair.id);

                const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>) => {
                  const target = event.target as HTMLElement;
                  if (target.closest('button, input[type="checkbox"]')) {
                    return;
                  }
                  onToggleSelect(repair.id);
                };

                return (
                  <tr
                    key={repair.id}
                    className={`border-b border-slate-700/20 transition-colors duration-150 hover:bg-slate-800/40 group cursor-pointer select-none ${selected ? 'bg-blue-500/5' : ''}`}
                    onClick={handleRowClick}
                  >
                    <td className="pl-5 pr-2 py-4">
                      <input
                        checked={selected}
                        className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/20 focus:ring-offset-0 cursor-pointer accent-blue-500"
                        onChange={() => onToggleSelect(repair.id)}
                        type="checkbox"
                      />
                    </td>
                    <td className="px-5 py-4 font-mono whitespace-nowrap">
                      <span className="text-blue-400 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded-md">
                        {repair.ticket}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">{repair.date}</td>
                    <td className="px-5 py-4 font-medium text-slate-200 whitespace-nowrap">{repair.customer}</td>
                    <td className="px-5 py-4 text-slate-300 whitespace-nowrap">{repair.items.join(', ')}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      {repair.specs ?? <span className="text-slate-700">&mdash;</span>}
                    </td>
                    <td className="px-5 py-4 overflow-visible whitespace-nowrap">
                      <StatusBadge
                        interactive
                        onChange={(newStatus: Status) => onStatusChange(repair.id, newStatus)}
                        status={repair.status}
                      />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                          onClick={() => onEdit(repair)}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                          onClick={() => onDelete(repair.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
