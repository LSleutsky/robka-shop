import { BrowserRouter, Route, Routes } from 'react-router';

import Home from '@/site/pages/Home';

export default function SiteApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
    </BrowserRouter>
  );
}
