import { clsx } from 'clsx';
import { Plus, Pencil, X, Loader2, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

import DatePicker from '@/components/DatePicker';
import Field from '@/components/Field';

import { STATUSES, STATUS_CONFIG } from '@/config/statuses';
import { inputBase } from '@/constants';
import { Repair, RepairForm, Status } from '@/types';
import { formatPhone } from '@/utils';

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

function StatusSelect({ value, onChange }: { value: Status; onChange: (s: Status) => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const config = STATUS_CONFIG[value];
  const Icon = config.icon;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - rect.width - 8);

    setPosition({ top: rect.bottom + 6, left: Math.max(8, left), width: rect.width });
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const handleClose = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClose);

    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, [open, updatePosition]);

  return (
    <>
      <button
        ref={buttonRef}
        className={clsx(inputBase, 'flex items-center justify-between gap-2 text-left')}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span className="flex items-center gap-2.5">
          <span className={clsx('flex items-center justify-center w-5 h-5 rounded-md', config.bg)}>
            <Icon className={clsx('w-3.5 h-3.5', config.text)} />
          </span>
          <span className={config.text}>{config.label}</span>
        </span>
        <ChevronDown
          className={clsx('w-4 h-4 text-slate-500 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-100 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/40 overflow-hidden py-1"
            style={{ top: position.top, left: position.left, width: position.width }}
          >
            {STATUSES.map(status => {
              const optionConfig = STATUS_CONFIG[status];
              const OptionIcon = optionConfig.icon;
              const isActive = status === value;

              return (
                <button
                  key={status}
                  className={clsx(
                    'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors duration-150',
                    isActive ? 'bg-slate-700/50 text-white' : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                  )}
                  onClick={() => {
                    onChange(status);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span
                    className={clsx(
                      'flex items-center justify-center w-5 h-5 rounded-md',
                      isActive ? optionConfig.bg : 'bg-slate-700/40'
                    )}
                  >
                    <OptionIcon className={clsx('w-3.5 h-3.5', optionConfig.text)} />
                  </span>
                  {optionConfig.label}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-y-auto max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)]">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="border-b border-slate-800/60 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Ticket *">
              <input
                autoFocus
                className={inputBase}
                onChange={event => onFormChange({ ticket: event.target.value })}
                placeholder="TKT-100"
                type="text"
                value={form.ticket}
              />
            </Field>
            <Field label="Date">
              <DatePicker onChange={date => onFormChange({ date })} value={form.date} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Customer Name *">
              <input
                className={inputBase}
                onChange={event => onFormChange({ customer: event.target.value })}
                placeholder="Robert Gutman"
                type="text"
                value={form.customer}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputBase}
                onChange={event => onFormChange({ phone: formatPhone(event.target.value) })}
                placeholder="(555) 123-4567"
                type="tel"
                value={form.phone}
              />
            </Field>
          </div>
          <Field label="Items *">
            <input
              className={inputBase}
              onChange={event => onItemsInputChange(event.target.value)}
              placeholder="Wedding Ring, Earrings, Necklace..."
              type="text"
              value={itemsInput}
            />
          </Field>
          <Field label="Specs">
            <textarea
              className={`${inputBase} resize-none`}
              onChange={event => onFormChange({ specs: event.target.value })}
              placeholder="Solder, Polish, Stone Replacement..."
              rows={3}
              value={form.specs}
            />
          </Field>
          <Field label="Status">
            <StatusSelect onChange={status => onFormChange({ status })} value={form.status} />
          </Field>
        </div>
        <div className="border-t border-slate-800/60 px-4 sm:px-6 py-4 flex justify-end gap-3">
          <button
            className="inline-flex items-center px-6 py-2.5 text-sm text-slate-400 hover:text-red-400 rounded-xl border border-slate-700/40 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-200 font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={clsx(
              'relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl border border-transparent transition-all duration-300',
              'bg-linear-to-r from-blue-500 to-violet-600 text-white',
              'shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:brightness-110',
              'disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:shadow-none'
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
