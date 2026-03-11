import { Gem, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatCurrency } from '@/utils';

interface MetalsData {
  gold: number;
  silver: number;
  platinum: number;
}

const getCalculations = (gold: number, silver: number, platinum: number) => [
  { name: '6K', value: (gold * 0.87 * 0.25) / 20 },
  { name: '8K', value: (gold * 0.87 * 0.31) / 20 },
  { name: '9K', value: (gold * 0.87 * 0.325) / 20 },
  { name: '10K', value: (gold * 0.87 * 0.396) / 20 },
  { name: '12K', value: (gold * 0.87 * 0.48) / 20 },
  { name: '14K', value: (gold * 0.87 * 0.565) / 20 },
  { name: '16K', value: (gold * 0.87 * 0.642) / 20 },
  { name: '18K', value: (gold * 0.87 * 0.73) / 20 + 0.1 },
  { name: '20K', value: (gold * 0.87 * 0.794) / 20 },
  { name: '21K', value: (gold * 0.87 * 0.854) / 20 },
  { name: '22K', value: (gold * 0.9 * 0.87) / 20 },
  { name: '24K', value: (gold * 0.99 * 0.87) / 20 },
  { name: 'American Coins | 1838 - 1933 (per coin)', value: gold * 0.96 * 0.95 - 50 },
  { name: 'American Coins | 1986 - present', value: gold * 0.99 * 0.95 - 50 },
  { name: 'Sterling', value: silver * 0.8 },
  { name: 'Pure Silver', value: silver * 0.87 },
  { name: 'Coin Silver', value: silver * 0.675 },
  { name: '800 Silver', value: silver * 0.61 },
  { name: 'Silver Dollar', value: silver * 0.77 },
  { name: 'Silver Change ($1 face)', value: silver * 0.717 },
  { name: 'Platinum', value: (platinum * 0.68) / 20 }
];

const spotPrices = [
  {
    key: 'gold',
    label: 'Gold',
    color: 'text-yellow-400',
    iconColor: 'text-yellow-500',
    bg: 'bg-yellow-500/15 border-yellow-500/40'
  },
  {
    key: 'silver',
    label: 'Silver',
    color: 'text-slate-300',
    iconColor: 'text-slate-200',
    bg: 'bg-slate-300/15 border-slate-300/40'
  },
  {
    key: 'platinum',
    label: 'Platinum',
    color: 'text-slate-100',
    iconColor: 'text-white',
    bg: 'bg-white/15 border-white/40'
  }
];

export default function LivePrices() {
  const [metals, setMetals] = useState<MetalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/metals');
        const data = await response.json();

        setMetals({
          gold: data.metals.gold,
          silver: data.metals.silver,
          platinum: data.metals.platinum
        });
        setTimestamp(
          new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })
        );
      } catch {
        setError('Failed to load prices. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 left-1/4 w-150 h-150 bg-blue-600/4 rounded-full blur-[120px]" />
        <div className="absolute -top-48 right-1/4 w-150 h-150 bg-violet-600/3 rounded-full blur-[120px]" />
      </div>
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">Live Prices</h1>
            <p className="mt-4 sm:mt-6 text-lg text-slate-400 leading-relaxed">
              Real-time precious metal spot prices and calculated buy rates.
            </p>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-16 sm:pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : metals ? (
            <>
              <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">
                {spotPrices.map(spot => (
                  <div
                    key={spot.key}
                    className="group rounded-2xl border border-slate-700/30 bg-slate-900/30 p-4 sm:p-7 flex flex-col items-center"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border ${spot.bg} flex items-center justify-center mb-3 sm:mb-4`}
                    >
                      <Gem className={`size-8 sm:size-12 ${spot.iconColor}`} strokeWidth={1.5} />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      {spot.label}
                    </p>
                    <p className={`text-lg sm:text-3xl font-bold font-mono ${spot.color}`}>
                      {formatCurrency.format(metals[spot.key as keyof MetalsData])}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">per troy oz</p>
                  </div>
                ))}
              </div>
              {timestamp && (
                <p className="text-sm text-slate-400 text-center mb-6 sm:mb-8">Current prices as of {timestamp}</p>
              )}
              <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 overflow-hidden">
                {getCalculations(metals.gold, metals.silver, metals.platinum).map((calculation, index) => (
                  <div
                    key={calculation.name}
                    className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 ${
                      index !== 0 ? 'border-t border-slate-700/20' : ''
                    }`}
                  >
                    <span className="text-sm sm:text-base text-slate-300">{calculation.name}</span>
                    <span className="text-sm sm:text-base font-mono font-semibold text-white">
                      {formatCurrency.format(calculation.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
