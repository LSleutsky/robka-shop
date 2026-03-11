import { Award, Clock, GraduationCap, Handshake } from 'lucide-react';

const milestones = [
  {
    icon: GraduationCap,
    year: '1987',
    title: 'The Beginning',
    description:
      "Started on Philadelphia's historic Jewelers Row, training under master goldsmiths from Russia, Ukraine, Italy, and Armenia in the art of bench work."
  },
  {
    icon: Award,
    year: '1990s',
    title: 'Mastering the Craft',
    description:
      'Years of intensive hands-on work across all aspects of jewelry making, building deep expertise in diamonds, gemstones, and high-end timepieces.'
  },
  {
    icon: Handshake,
    year: '2001',
    title: 'Golden Nugget',
    description:
      'Established a comprehensive jewelry service within the Golden Nugget Antique Market in Lambertville, New Jersey - serving customers ever since.'
  },
  {
    icon: Clock,
    year: 'Today',
    title: 'Decades of Trust',
    description:
      'Leveraging extensive knowledge, years of experience, and a solid reputation to offer customers the finest craftsmanship and competitive pricing.'
  }
];

const stats = [
  { label: 'Years of Experience', value: '35+' },
  { label: 'Located In', value: 'Lambertville, NJ' },
  { label: 'Specialties', value: 'Jewelry, Watches, Gems' }
];

export default function About() {
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
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">About</h1>
            <p className="mt-4 sm:mt-6 text-lg text-slate-400 leading-relaxed">
              Hand crafted fine jewelry and great finds - built on decades of expertise passed down from the finest
              craftsmen in the trade.
            </p>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono mb-4">The Story</h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-400 leading-relaxed">
                <p>
                  The journey began in 1987 on Philadelphia's renowned Jewelers Row, where the fundamentals of the craft
                  were learned under the guidance of experienced goldsmiths from Russia, Ukraine, Italy, and Armenia.
                  These master craftsmen instilled a deep understanding of bench work techniques that remains the
                  foundation of every piece created today.
                </p>
                <p>
                  Since 2001, Robka Shop has operated a comprehensive jewelry service within the Golden Nugget Antique
                  Market in Lambertville, New Jersey. This established location has become a destination for customers
                  seeking quality craftsmanship, unique finds, and honest expertise.
                </p>
                <p>
                  With valuable connections to esteemed dealers in diamonds, gemstones, high-end and vintage watches,
                  and other wholesale avenues, Robka Shop is able to source exceptional pieces and pass significant
                  savings on to customers.
                </p>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-5">
              {milestones.map(item => (
                <div
                  key={item.year}
                  className="group flex gap-4 sm:gap-5 rounded-2xl border border-slate-700/30 bg-slate-900/30 p-5 sm:p-6 transition-all duration-300 hover:border-slate-600/40 hover:bg-slate-900/50"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center group-hover:border-blue-500/30 transition-colors duration-300">
                    <item.icon className="size-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-400/80 font-mono">{item.year}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {stats.map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-700/30 bg-slate-900/30 p-6 sm:p-7 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{stat.value}</p>
                <p className="mt-1.5 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
