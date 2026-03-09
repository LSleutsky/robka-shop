import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import usePortalDropdown from '@/repairs/hooks/usePortalDropdown';

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
  const { buttonRef, dropdownRef, open, setOpen, position } = usePortalDropdown({
    width: 'match',
    anchor: 'above',
    offset: 6
  });

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
