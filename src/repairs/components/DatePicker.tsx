import { clsx } from 'clsx';
import { format, parse } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { DayPicker, UI, DayFlag, SelectionState } from 'react-day-picker';
import { createPortal } from 'react-dom';

import { inputBase } from '@/repairs/constants';
import usePortalDropdown from '@/repairs/hooks/usePortalDropdown';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const {
    buttonRef,
    dropdownRef: calendarRef,
    open,
    setOpen,
    position
  } = usePortalDropdown({
    width: 320,
    anchor: 'below',
    offset: 6
  });

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined;
  const today = new Date();

  const [month, setMonth] = useState(selected ?? today);

  return (
    <>
      <button
        ref={buttonRef}
        className={clsx(inputBase, 'flex items-center justify-between gap-2 text-left')}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span>{selected ? format(selected, 'MMMM do, yyyy') : 'Pick a date'}</span>
        <CalendarDays className="w-4 h-4 text-slate-500" />
      </button>
      {open &&
        createPortal(
          <div
            ref={calendarRef}
            className="fixed z-100 bg-slate-800 border border-slate-700/50 rounded-xl shadow-xl shadow-black/40 p-3 max-w-[calc(100vw-1rem)]"
            style={{ top: position.top, left: position.left }}
          >
            <DayPicker
              classNames={{
                [UI.Root]: 'text-slate-100 text-sm',
                [UI.Months]: 'flex flex-col',
                [UI.Month]: 'space-y-3',
                [UI.MonthCaption]: 'flex justify-center items-center h-8',
                [UI.CaptionLabel]: 'text-sm font-semibold text-slate-200',
                [UI.Nav]: 'flex items-center justify-between absolute inset-x-3 top-3',
                [UI.PreviousMonthButton]:
                  'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors',
                [UI.NextMonthButton]:
                  'p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors',
                [UI.Chevron]: 'w-4 h-4',
                [UI.MonthGrid]: 'border-collapse',
                [UI.Weekdays]: '',
                [UI.Weekday]: 'text-[11px] font-medium text-slate-500 uppercase w-9 h-8',
                [UI.Weeks]: '',
                [UI.Week]: '',
                [UI.Day]:
                  'w-9 h-9 text-center text-sm p-0 relative focus-within:z-20 [&:has(button)]:hover:bg-slate-700/40 rounded-lg transition-colors',
                [UI.DayButton]:
                  'w-full h-full flex items-center justify-center rounded-lg font-medium transition-colors text-slate-300 hover:text-white',
                [DayFlag.today]: 'ring-1 ring-blue-500/50',
                [DayFlag.outside]: 'opacity-30',
                [DayFlag.disabled]: 'opacity-20',
                [SelectionState.selected]: 'bg-blue-500/20 text-blue-400',
                [SelectionState.range_start]: '',
                [SelectionState.range_end]: '',
                [SelectionState.range_middle]: ''
              }}
              footer={
                month.getMonth() !== today.getMonth() || month.getFullYear() !== today.getFullYear() ? (
                  <div className="pt-2 mt-2 border-t border-slate-700/40 flex justify-center">
                    <button
                      className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                      onClick={() => {
                        setMonth(today);
                      }}
                      type="button"
                    >
                      Today
                    </button>
                  </div>
                ) : undefined
              }
              mode="single"
              modifiersClassNames={{
                selected: 'bg-blue-500 !text-white font-semibold'
              }}
              month={month}
              onMonthChange={setMonth}
              onSelect={date => {
                if (date) {
                  onChange(format(date, 'yyyy-MM-dd'));
                  setOpen(false);
                }
              }}
              selected={selected}
            />
          </div>,
          document.body
        )}
    </>
  );
}
