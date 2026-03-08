import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

import { STATUSES, STATUS_CONFIG } from '@/config/statuses';
import { Status } from '@/types';

interface StatusBadgeProps {
  status: Status;
  interactive?: boolean;
  onChange?: (s: Status) => void;
}

interface DropdownPosition {
  top: number;
  left: number;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition>({ top: 0, left: 0 });

  const config = STATUS_CONFIG[status];

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownWidth = 140;
    const left = Math.min(rect.left, window.innerWidth - dropdownWidth - 8);

    setPosition({
      top: rect.top - 4,
      left: Math.max(8, left)
    });
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
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClose);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  const badge = (
    <button
      ref={buttonRef}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset transition-all duration-200',
        config.bg,
        config.text,
        config.ring,
        interactive && 'cursor-pointer hover:brightness-125'
      )}
      onClick={interactive ? () => setOpen(!open) : undefined}
    >
      <StatusPill iconClass="w-3 h-3" status={status} />
      {interactive && <ChevronDown className="w-3 h-3 opacity-50" />}
    </button>
  );

  if (!interactive) {
    return badge;
  }

  return (
    <>
      {badge}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-50 min-w-35 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/30 overflow-hidden py-1"
            style={{ top: position.top, left: position.left, transform: 'translateY(-100%)' }}
          >
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
                <StatusPill iconClass="w-3.5 h-3.5" status={option} />
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
