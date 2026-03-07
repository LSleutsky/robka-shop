import { clsx } from 'clsx';

import { STATUSES, STATUS_CONFIG } from '@/config/statuses';
import { Status } from '@/types';

interface StatsBarProps {
  counts: Record<Status, number>;
  filterStatus: Status | 'all';
  hasRepairs: boolean;
  onFilterChange: (status: Status | 'all') => void;
}

export default function StatsBar({ counts, filterStatus, hasRepairs, onFilterChange }: StatsBarProps) {
  return (
    <div className="pb-5">
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/50 backdrop-blur-sm overflow-hidden grid grid-cols-2 md:grid-cols-4">
        {STATUSES.map((status, index) => {
          const active = filterStatus === status;
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;

          return (
            <button
              key={status}
              className={clsx(
                'relative group p-4 text-left transition-all duration-300',
                !hasRepairs && '!cursor-default',
                active ? 'bg-slate-800/50' : hasRepairs && 'hover:bg-slate-800/20',
                index % 2 !== 0 && 'border-l border-slate-700/30',
                index >= 2 && 'border-t border-slate-700/30 md:border-t-0',
                index >= 1 && 'md:border-l md:border-slate-700/30'
              )}
              onClick={hasRepairs ? () => onFilterChange(active ? 'all' : status) : undefined}
            >
              <div
                className={clsx(
                  'absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500',
                  config.gradient,
                  active && 'opacity-100'
                )}
              />
              <div className="relative flex items-center gap-3 lg:gap-4">
                <div
                  className={clsx(
                    'shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center ring-1 ring-inset',
                    config.bg,
                    config.ring
                  )}
                >
                  <Icon className={clsx('w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7', config.text)} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-extrabold font-mono text-white tabular-nums leading-none mb-1">
                    {counts[status]}
                  </div>
                  <div
                    className={clsx(
                      'text-[11px] md:text-xs lg:text-sm font-semibold uppercase tracking-wider whitespace-nowrap',
                      active ? config.text : 'text-slate-500'
                    )}
                  >
                    {config.label}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
