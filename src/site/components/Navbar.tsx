import { clsx } from 'clsx';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import Logo from '@/site/components/Logo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/live-prices', label: 'Live Prices' },
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
          {pathname !== '/' ? (
            <Link className="block" onClick={() => setOpen(false)} to="/">
              <Logo className="h-16 sm:h-18 w-auto" color="#cbd5e1" />
            </Link>
          ) : (
            <div />
          )}
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
        <>
          <div className="sm:hidden fixed inset-0 top-16" onClick={() => setOpen(false)} />
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
        </>
      )}
    </nav>
  );
}
