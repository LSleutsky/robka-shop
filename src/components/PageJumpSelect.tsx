import { ChevronsUpDown } from 'lucide-react';
import { useMemo } from 'react';

import PortalSelect from '@/components/PortalSelect';

interface PageJumpSelectProps {
  value: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function PageJumpSelect({ value, totalPages, onChange }: PageJumpSelectProps) {
  const options = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => ({ value: index, label: String(index + 1) })),
    [totalPages]
  );

  return (
    <PortalSelect maxHeight="200px" onChange={onChange} options={options} value={value}>
      {String(value + 1)}
      <ChevronsUpDown className="w-3 h-3 text-slate-500" />
    </PortalSelect>
  );
}
