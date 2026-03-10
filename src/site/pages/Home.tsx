import { ArrowRight, Gem, Shield, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router';

import Logo from '@/site/components/Logo';

const highlights = [
  {
    icon: Gem,
    title: 'Fine Jewelry',
    description: 'Hand crafted pieces in gold, platinum, and silver with expert attention to detail.'
  },
  {
    icon: Wrench,
    title: 'Expert Repairs',
    description: 'From minor fixes to complex restorations, backed by decades of bench work experience.'
  },
  {
    icon: Sparkles,
    title: 'Custom Design',
    description: 'Collaborate to transform your vision into a one-of-a-kind piece you will treasure.'
  },
  {
    icon: Shield,
    title: 'Trusted Since 1987',
    description: 'Trained under master goldsmiths with connections to the finest dealers worldwide.'
  }
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-48 left-1/4 w-150 h-150 bg-blue-600/4 rounded-full blur-[120px]" />
          <div className="absolute -top-48 right-1/4 w-150 h-150 bg-violet-600/3 rounded-full blur-[120px]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-36 pb-20 sm:pb-28">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
            <Logo className="w-full max-w-sm sm:max-w-xl" />
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed">
              Hand crafted fine jewelry and great finds. Serving customers with expert craftsmanship since 1987.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Link
                className="group relative inline-flex items-center gap-2 font-semibold text-sm transition-all duration-300 active:scale-[0.97]"
                to="/services"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-violet-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-violet-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow duration-500">
                  Our Services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </Link>
              <Link
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-slate-700/40 hover:border-slate-600/60 transition-all duration-200"
                to="/contact"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {highlights.map(item => (
              <div
                key={item.title}
                className="group relative rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7 transition-all duration-300 hover:border-slate-600/40 hover:bg-slate-900/50"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center mb-4 group-hover:border-blue-500/30 transition-colors duration-300">
                  <item.icon className="size-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/3 w-120 h-120 bg-violet-600/3 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              Looking for something special?
            </h2>
            <p className="mt-3 text-slate-400 text-base sm:text-lg max-w-lg mx-auto">
              Whether it is a custom piece, a vintage find, or expert repair work - reach out and let us help.
            </p>
            <Link
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 active:scale-[0.97]"
              to="/contact"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
