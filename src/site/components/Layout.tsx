import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router';

import Footer from '@/site/components/Footer';
import Navbar from '@/site/components/Navbar';

export default function Layout({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-[#050810] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-18">{children}</main>
      <Footer />
    </div>
  );
}
