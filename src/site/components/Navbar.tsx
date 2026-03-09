import { clsx } from 'clsx';
import { Gem, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#050810]/80 backdrop-blur-xl border-b border-slate-700/30" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link className="flex items-center gap-2.5 group" onClick={() => setOpen(false)} to="/">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500 to-violet-600 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Gem className="size-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-mono">Robka Shop</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.to
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                )}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            className="sm:hidden relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors duration-200"
            onClick={() => setOpen(state => !state)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="sm:hidden relative bg-[#050810]/95 backdrop-blur-xl border-b border-slate-700/30">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                className={clsx(
                  'block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.to
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                )}
                onClick={() => setOpen(false)}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
