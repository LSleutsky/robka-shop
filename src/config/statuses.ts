import { Clock, CircleDot, CheckCircle2, PackageCheck } from 'lucide-react';
import type { Status } from '@/types';

export interface StatusConfig {
  label: string;
  icon: typeof Clock;
  gradient: string;
  text: string;
  bg: string;
  ring: string;
  dot: string;
  glow: string;
}

export const STATUSES: Status[] = ['Pending', 'In Progress', 'Done', 'Picked Up'];

export const STATUS_CONFIG: Record<Status, StatusConfig> = {
  Pending: {
    label: 'Pending',
    icon: Clock,
    gradient: 'from-amber-500/20 to-orange-500/10',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/20',
    dot: 'bg-amber-400',
    glow: 'shadow-amber-500/10'
  },
  'In Progress': {
    label: 'In Progress',
    icon: CircleDot,
    gradient: 'from-blue-500/20 to-cyan-500/10',
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    ring: 'ring-blue-500/20',
    dot: 'bg-blue-400',
    glow: 'shadow-blue-500/10'
  },
  Done: {
    label: 'Done',
    icon: CheckCircle2,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/20',
    dot: 'bg-emerald-400',
    glow: 'shadow-emerald-500/10'
  },
  'Picked Up': {
    label: 'Picked Up',
    icon: PackageCheck,
    gradient: 'from-violet-500/20 to-purple-500/10',
    text: 'text-violet-400',
    bg: 'bg-violet-500/10',
    ring: 'ring-violet-500/20',
    dot: 'bg-violet-400',
    glow: 'shadow-violet-500/10'
  }
};
