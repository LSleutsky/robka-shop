import { BrowserRouter, Route, Routes } from 'react-router';

import Layout from '@/site/components/Layout';
import About from '@/site/pages/About';
import Contact from '@/site/pages/Contact';
import Home from '@/site/pages/Home';
import LivePrices from '@/site/pages/LivePrices';
import Services from '@/site/pages/Services';

export default function SiteApp() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<About />} path="/about" />
          <Route element={<Services />} path="/services" />
          <Route element={<LivePrices />} path="/live-prices" />
          <Route element={<Contact />} path="/contact" />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
