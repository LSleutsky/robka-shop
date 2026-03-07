import { PropsWithChildren } from 'react';

interface FieldProps extends PropsWithChildren {
  label: string;
}

export default function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}
