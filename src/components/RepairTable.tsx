import { clsx } from 'clsx';
import { Pencil, Trash2, Loader2 } from 'lucide-react';

import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';

import { Repair, Status } from '@/types';

interface RepairTableProps {
  repairs: Repair[];
  filtered: Repair[];
  loading: boolean;
  onEdit: (repair: Repair) => void;
  onDelete: (id: number, name: string) => void;
  onStatusChange: (id: number, status: Status) => void;
}

const COLUMNS = ['Ticket', 'Date', 'Customer', 'Item', 'Specs', 'Status', ''];

export default function RepairTable({
  repairs,
  filtered,
  loading,
  onEdit,
  onDelete,
  onStatusChange
}: RepairTableProps) {
  return (
    <div className="pb-8 mt-1">
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 overflow-hidden backdrop-blur-sm shadow-lg shadow-black/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-600">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500/60 mb-3" />
            <p className="text-sm font-medium">Loading repairs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasRepairs={repairs.length > 0} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/30">
                  {COLUMNS.map(column => (
                    <th
                      key={column}
                      className={clsx(
                        'px-5 py-3.5 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest',
                        column === 'Ticket' && 'font-mono'
                      )}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(repair => (
                  <tr
                    key={repair.id}
                    className="border-b border-slate-700/20 transition-colors duration-150 hover:bg-slate-800/40 group"
                  >
                    <td className="px-5 py-4 font-mono">
                      <span className="text-blue-400 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded-md">
                        {repair.ticket}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">{repair.date}</td>
                    <td className="px-5 py-4 font-medium text-slate-200">{repair.customer}</td>
                    <td className="px-5 py-4 text-slate-300">{repair.item}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-50">
                      <span className="block truncate" title={repair.specs ?? ''}>
                        {repair.specs ?? <span className="text-slate-700">&mdash;</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge
                        interactive
                        onChange={(newStatus: Status) => onStatusChange(repair.id, newStatus)}
                        status={repair.status}
                      />
                    </td>
                    <td className="px-5 py-4">
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
                          onClick={() => onDelete(repair.id, repair.customer)}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
