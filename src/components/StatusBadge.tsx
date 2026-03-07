import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { STATUSES, STATUS_CONFIG } from '@/config/statuses';
import { Status } from '@/types';

interface StatusBadgeProps {
  status: Status;
  interactive?: boolean;
  onChange?: (s: Status) => void;
}

const StatusPill = ({ iconClass, status }: { iconClass: string; status: Status }) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <>
      <Icon className={clsx(iconClass, config.text)} />
      {config.label}
    </>
  );
};

export default function StatusBadge({ status, interactive, onChange }: StatusBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const config = STATUS_CONFIG[status];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  const badge = (
    <button
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset transition-all duration-200',
        config.bg,
        config.text,
        config.ring,
        interactive && 'cursor-pointer hover:brightness-125'
      )}
      onClick={interactive ? () => setOpen(!open) : undefined}
    >
      <StatusPill iconClass="w-3 h-3" s={status} />
      {interactive && <ChevronDown className="w-3 h-3 opacity-50" />}
    </button>
  );

  if (!interactive) return badge;

  return (
    <div ref={ref} className="relative">
      {badge}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-35 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/30 overflow-hidden py-1">
          {STATUSES.map(option => (
            <button
              key={option}
              className={clsx(
                'w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors',
                option === status
                  ? 'bg-slate-700/50 text-white'
                  : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
              )}
              onClick={() => {
                onChange?.(option);
                setOpen(false);
              }}
            >
              <StatusPill iconClass="w-3.5 h-3.5" s={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
