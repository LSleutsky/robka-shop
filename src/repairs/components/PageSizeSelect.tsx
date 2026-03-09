import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

import PortalSelect from '@/repairs/components/PortalSelect';

interface PageSizeSelectProps {
  value: number;
  onChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [
  { value: 15, label: '15' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 75, label: '75' },
  { value: 0, label: 'Show All' }
];

export default function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <PortalSelect onChange={onChange} options={PAGE_SIZE_OPTIONS} value={value}>
      {value === 0 ? 'All' : String(value)}
      <ChevronRight className={clsx('w-3 h-3 text-slate-500 transition-transform duration-200')} />
    </PortalSelect>
  );
}
