import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  tickets?: string[];
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel,
  tickets,
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={event => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-500/30 to-transparent" />
        <div className="px-6 py-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white">{title}</h3>
              {!(tickets && tickets.length > 1) && (
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">{message}</p>
              )}
            </div>
            <button
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-200 shrink-0 self-start"
              onClick={onCancel}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {tickets && tickets.length > 1 && (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Tickets scheduled for deletion:</p>
              <ul className="mt-2 max-h-21.25 overflow-y-auto space-y-1 rounded-lg bg-slate-800/50 border border-slate-700/30 p-2">
                {tickets.map(ticket => (
                  <li
                    key={ticket}
                    className="text-xs font-mono font-bold text-slate-300 bg-slate-700/40 px-2.5 py-1.5 rounded-md"
                  >
                    {ticket}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-500">Are you sure? This cannot be undone.</p>
            </div>
          )}
        </div>
        <div className="border-t border-slate-800/60 px-6 py-4 flex justify-end gap-3">
          <button
            className="px-4 py-2.5 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all duration-200 font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-red-500/90 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
