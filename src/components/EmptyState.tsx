import { Logs, Search } from 'lucide-react';

interface EmptyStateProps {
  hasRepairs: boolean;
}

export default function EmptyState({ hasRepairs }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-28">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
        {hasRepairs ? <Search className="w-6 h-6 text-slate-600" /> : <Logs className="w-6 h-6 text-slate-600" />}
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{hasRepairs ? 'No results' : 'No repairs yet'}</p>
      <p className="text-slate-600 text-xs">
        {hasRepairs ? 'Try a different search or filter.' : 'Create your first ticket to get started.'}
      </p>
    </div>
  );
}
