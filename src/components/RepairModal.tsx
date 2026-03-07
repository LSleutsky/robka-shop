import { clsx } from 'clsx';
import { Plus, Pencil, X, Loader2 } from 'lucide-react';

import Field from '@/components/Field';

import { STATUSES, STATUS_CONFIG } from '@/config/statuses';
import { Repair, RepairForm } from '@/types';

interface RepairModalProps {
  form: RepairForm;
  editingRepair: Repair | null;
  saving: boolean;
  itemsInput: string;
  onFormChange: (updates: Partial<RepairForm>) => void;
  onItemsInputChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const inputBase =
  'w-full bg-slate-800/80 border border-slate-600/40 text-slate-100 px-3.5 py-2.5 text-sm rounded-xl focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all duration-200 hover:border-slate-500/50 shadow-sm shadow-black/10';

export default function RepairModal({
  form,
  editingRepair,
  saving,
  itemsInput,
  onFormChange,
  onItemsInputChange,
  onSave,
  onClose
}: RepairModalProps) {
  const canSave = form.ticket.trim() && form.customer.trim() && itemsInput.trim().length > 0 && !saving;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="border-b border-slate-800/60 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center">
              {editingRepair ? (
                <Pencil className="w-4 h-4 text-blue-400" />
              ) : (
                <Plus className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <h2 className="text-base font-bold text-white font-mono">
              {editingRepair ? `Edit ${editingRepair.ticket}` : 'New Repair'}
            </h2>
          </div>
          <button
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-200"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ticket *">
              <input
                autoFocus
                className={inputBase}
                onChange={event => onFormChange({ ticket: event.target.value })}
                placeholder="TKT-1000"
                type="text"
                value={form.ticket}
              />
            </Field>
            <Field label="Date">
              <input
                className={inputBase}
                onChange={event => onFormChange({ date: event.target.value })}
                type="date"
                value={form.date}
              />
            </Field>
          </div>
          <Field label="Customer *">
            <input
              className={inputBase}
              onChange={event => onFormChange({ customer: event.target.value })}
              placeholder="John Smith"
              type="text"
              value={form.customer}
            />
          </Field>
          <Field label="Items *">
            <input
              className={inputBase}
              onChange={event => onItemsInputChange(event.target.value)}
              placeholder="Laptop, iPhone 14, Samsung TV..."
              type="text"
              value={itemsInput}
            />
          </Field>
          <Field label="Specs">
            <textarea
              className={`${inputBase} resize-none`}
              onChange={event => onFormChange({ specs: event.target.value })}
              placeholder="Screen replacement, battery swap, diagnostics..."
              rows={3}
              value={form.specs}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputBase}
              onChange={event => onFormChange({ status: event.target.value as RepairForm['status'] })}
              value={form.status}
            >
              {STATUSES.map(status => (
                <option key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="border-t border-slate-800/60 px-6 py-4 flex justify-end gap-3">
          <button
            className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={clsx(
              'relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300',
              'bg-linear-to-r from-blue-500 to-violet-600 text-white',
              'hover:shadow-lg hover:shadow-blue-500/25 hover:brightness-110',
              'disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none disabled:cursor-not-allowed'
            )}
            disabled={!canSave}
            onClick={onSave}
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving...' : editingRepair ? 'Save Changes' : 'Create Repair'}
          </button>
        </div>
      </div>
    </div>
  );
}
