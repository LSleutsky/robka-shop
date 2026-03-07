import { Pencil, Trash2, Loader2, Download } from 'lucide-react';

import EmptyState from '@/components/EmptyState';
import StatusBadge from '@/components/StatusBadge';

import { Repair, Status } from '@/types';
import { formatDate } from '@/utils';

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
  onExport: () => void;
}

const GRID_COLS =
  'grid-cols-[3rem_minmax(5rem,1fr)_minmax(5rem,1fr)_minmax(6rem,1.5fr)_minmax(6rem,2fr)_minmax(6rem,2fr)_minmax(7rem,1.2fr)_5.5rem]';

const CELL = 'px-4 py-3.5 flex items-center justify-center text-center';
const CELL_FIRST = 'px-2 py-3.5 flex items-center justify-center sticky left-0 z-10';
const CELL_LAST = 'pl-2 pr-5 py-3.5';
const HEADER_BG = 'bg-[#151a2c] border-b border-slate-700/40';
const ROW_ODD = 'bg-[#080b14]';
const ROW_EVEN = 'bg-[#0c1019]';
const ROW_SELECTED = 'bg-[#0b1528]';
const ROW_HOVER = 'group-hover/row:bg-[#131825]';

const HEADERS = [
  { label: 'Ticket', className: CELL },
  { label: 'Date', className: CELL },
  { label: 'Customer', className: CELL },
  { label: 'Items', className: CELL },
  { label: 'Specs', className: CELL },
  { label: 'Status', className: CELL }
];

export default function RepairTable({
  repairs,
  filteredRepairs,
  loading,
  selectedIds,
  onEdit,
  onDelete,
  onToggleSelect,
  onToggleAll,
  onStatusChange,
  onExport
}: RepairTableProps) {
  const allSelected = filteredRepairs.length > 0 && filteredRepairs.every(repair => selectedIds.has(repair.id));

  const handleRowClick = (event: React.MouseEvent, id: number) => {
    const target = event.target as HTMLElement;

    if (target.closest('button, input[type="checkbox"]')) {
      return;
    }

    onToggleSelect(id);
  };

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
          <div className={`grid ${GRID_COLS} min-w-175`}>
            <div className={`${CELL_FIRST} ${HEADER_BG}`}>
              <input
                checked={allSelected}
                className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 accent-blue-500"
                onChange={onToggleAll}
                type="checkbox"
              />
            </div>
            {HEADERS.map(header => (
              <div
                key={header.label}
                className={`${header.className} ${HEADER_BG} text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap`}
              >
                {header.label}
              </div>
            ))}
            <div className={`${CELL_LAST} ${HEADER_BG}`} />
            {filteredRepairs.map((repair, index) => {
              const selected = selectedIds.has(repair.id);
              const stripe = index % 2 === 0 ? ROW_ODD : ROW_EVEN;
              const rowBase = `border-b border-slate-700/20 transition-colors duration-150 ${ROW_HOVER} ${selected ? ROW_SELECTED : stripe}`;

              return (
                <div
                  key={repair.id}
                  className="group/row contents cursor-pointer select-none"
                  onClick={event => handleRowClick(event, repair.id)}
                >
                  <div className={`${CELL_FIRST} ${rowBase}`}>
                    <input
                      checked={selected}
                      className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 accent-blue-500"
                      onChange={() => onToggleSelect(repair.id)}
                      type="checkbox"
                    />
                  </div>
                  <div className={`${CELL} ${rowBase} font-mono whitespace-nowrap`}>
                    <span className="text-blue-400 font-bold text-xs bg-blue-500/10 px-2 py-1 rounded-md">
                      {repair.ticket}
                    </span>
                  </div>
                  <div className={`${CELL} ${rowBase} text-slate-500 whitespace-nowrap text-xs`}>
                    {formatDate(repair.date)}
                  </div>
                  <div className={`${CELL} ${rowBase} font-medium text-slate-200`}>{repair.customer}</div>
                  <div className={`${CELL} ${rowBase} text-slate-300`}>{repair.items.join(', ')}</div>
                  <div className={`${CELL} ${rowBase} text-slate-500`}>
                    {repair.specs ?? <span className="text-slate-700">&mdash;</span>}
                  </div>
                  <div className={`${CELL} ${rowBase} whitespace-nowrap`}>
                    <StatusBadge
                      interactive
                      onChange={(newStatus: Status) => onStatusChange(repair.id, newStatus)}
                      status={repair.status}
                    />
                  </div>
                  <div className={`${CELL_LAST} ${rowBase} whitespace-nowrap flex items-center justify-center`}>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {filteredRepairs.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white border border-slate-700/40 hover:border-slate-600 rounded-xl hover:bg-slate-800/60 transition-all duration-200"
            onClick={onExport}
          >
            <Download className="w-4 h-4" />
            Export to Spreadsheet
          </button>
        </div>
      )}
    </div>
  );
}
