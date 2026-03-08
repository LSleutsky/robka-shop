import { clsx } from 'clsx';
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface Option {
  value: number;
  label: string;
}

interface PortalSelectProps extends PropsWithChildren {
  options: Option[];
  value: number;
  onChange: (value: number) => void;
  maxHeight?: string;
}

export default function PortalSelect({ options, value, onChange, maxHeight, children }: PortalSelectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) {
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - rect.width - 8);

    setPosition({ top: rect.top - 6, left: Math.max(8, left), width: rect.width });
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
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-700/40 bg-slate-800/60 text-slate-300 text-xs font-medium hover:border-slate-600 hover:text-white transition-colors"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {children}
      </button>
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-100 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/40 overflow-y-auto py-1 flex flex-col items-stretch"
            style={{
              top: position.top,
              left: position.left,
              transform: 'translateY(-100%)',
              maxHeight
            }}
          >
            {options.map(option => (
              <button
                key={option.value}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium text-center transition-colors whitespace-nowrap',
                  option.value === value
                    ? 'bg-slate-700/50 text-white'
                    : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
