import { Gem } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-dvh bg-[#050810] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/4 w-150 h-150 bg-blue-600/4 rounded-full blur-[120px]" />
        <div className="absolute -top-48 right-1/4 w-150 h-150 bg-violet-600/3 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
      <div className="relative flex flex-col items-center">
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
          <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Gem className="size-11 text-white" strokeWidth={2} />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-mono">Robka Shop</h1>
        <p className="text-slate-500 font-medium text-base sm:text-lg mt-3">Jewelry and Repair</p>
      </div>
    </div>
  );
}
