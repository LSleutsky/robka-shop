import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const isRepairs = window.location.hostname.startsWith('repairs.');

const app = isRepairs
  ? import('@/repairs/Root').then(module => module.default)
  : import('@/site/App').then(module => module.default);

void app.then(App => {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
