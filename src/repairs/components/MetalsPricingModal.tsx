import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatCurrency, getMetalsCalculations } from '@/utils';

interface MetalsPricingModalProps {
  onClose: () => void;
}

export default function MetalsPricingModal({ onClose }: MetalsPricingModalProps) {
  const [calculations, setCalculations] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/metals');
        const data = await response.json();

        setCalculations(getMetalsCalculations(data.metals.gold, data.metals.silver, data.metals.platinum));
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
        setError('Failed to load prices.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-yellow-500/30 to-transparent" />
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-800/60 shrink-0">
          <div>
            <h3 className="text-base font-bold text-white">Buy Rates</h3>
            {timestamp && <p className="text-xs text-slate-500 mt-0.5">as of {timestamp}</p>}
          </div>
          <button
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all duration-200"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-6 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : (
            calculations.map((calc, index) => (
              <div
                key={calc.name}
                className={`flex items-center justify-between px-6 py-3 ${index !== 0 ? 'border-t border-slate-800/40' : ''}`}
              >
                <span className="text-sm text-slate-300">{calc.name}</span>
                <span className="text-sm font-mono font-semibold text-white">{formatCurrency.format(calc.value)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
