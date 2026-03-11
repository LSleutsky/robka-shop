import { Copyright } from 'lucide-react';
import { Link } from 'react-router';

import InstagramIcon from '@/site/components/InstagramIcon';
import Logo from '@/site/components/Logo';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-700/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          <div>
            <Link to="/">
              <Logo className="h-14 sm:h-16 w-auto mb-4" color="#cbd5e1" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Hand crafted fine jewelry and great finds since 1987.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Navigation</h3>
            <div className="space-y-2.5">
              <Link className="block text-sm text-slate-500 hover:text-white transition-colors duration-200" to="/">
                Home
              </Link>
              <Link
                className="block text-sm text-slate-500 hover:text-white transition-colors duration-200"
                to="/about"
              >
                About
              </Link>
              <Link
                className="block text-sm text-slate-500 hover:text-white transition-colors duration-200"
                to="/services"
              >
                Services
              </Link>
              <Link
                className="block text-sm text-slate-500 hover:text-white transition-colors duration-200"
                to="/contact"
              >
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Connect</h3>
            <a
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors duration-200"
              href="https://instagram.com/robs.place"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramIcon className="size-4" />
              @robs.place
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800/60">
          <p className="text-xs text-slate-600 text-center">
            <Copyright className="inline size-4 -mt-0.5 mr-0.5" /> {new Date().getFullYear()} Robka Shop. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
