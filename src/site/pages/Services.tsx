import { Crown, Factory, FileText, Gem, PenTool, RefreshCw, Shield, Sparkles, Wrench } from 'lucide-react';

const services = [
  {
    icon: Crown,
    title: 'Custom Design',
    description:
      'Collaborate to transform your vision into a breathtaking reality with a personalized, custom-designed piece tailored to your style.'
  },
  {
    icon: Factory,
    title: 'Manufacturing',
    description:
      'Professional jewelry creation with meticulous attention to detail and the highest standards of craftsmanship.'
  },
  {
    icon: Wrench,
    title: 'General Jewelry Repair',
    description:
      'Comprehensive restoration services addressing everything from minor fixes to complex repairs with precision and care.'
  },
  {
    icon: Gem,
    title: 'Diamond & Gemstone Setting',
    description:
      'Secure and stunning settings that showcase the natural beauty of your diamonds and gemstones with expert precision.'
  },
  {
    icon: RefreshCw,
    title: 'Restorations',
    description:
      'Reviving heirloom and vintage pieces with a deep understanding of historical techniques and craftsmanship.'
  },
  {
    icon: Sparkles,
    title: 'Refinishing',
    description:
      'Rejuvenate the appearance of your jewelry through professional polishing, texturing, or finish application.'
  },
  {
    icon: Shield,
    title: 'Prong Re-tipping',
    description:
      'Reinforce or replace worn prongs to keep your gemstones and diamonds securely in place for years to come.'
  },
  {
    icon: PenTool,
    title: 'Engravings',
    description:
      'Add a personal touch with custom engraving — from meaningful messages to intricate designs on any piece.'
  },
  {
    icon: FileText,
    title: 'Appraisals',
    description:
      'Detailed verbal and written jewelry valuations combining deep industry knowledge, expertise, and market awareness.'
  }
];

export default function Services() {
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
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">Services</h1>
            <p className="mt-4 sm:mt-6 text-lg text-slate-400 leading-relaxed">
              All services available in various karats and colors of gold, platinum, and silver. 100% workmanship and
              exceptional quality guaranteed.
            </p>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map(service => {
              const ServiceIcon = service.icon;

              return (
                <div
                  key={service.title}
                  className="group relative rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7 transition-all duration-300 hover:border-slate-600/40 hover:bg-slate-900/50"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center mb-4 group-hover:border-blue-500/30 transition-colors duration-300">
                    <ServiceIcon className="size-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
