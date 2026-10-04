'use client';

import dynamic from 'next/dynamic';

// App uses react-router hooks (useLocation, Routes, Link), so it must render
// inside a Router. ssr:false means this only runs in the browser, so
// BrowserRouter can safely read window.location.
const ClientApp = dynamic(
  async () => {
    const [{ BrowserRouter }, { default: App }] = await Promise.all([
      import('react-router-dom'),
      import('../App'),
    ]);
    return function RoutedApp() {
      return (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    };
  },
  { ssr: false },
);

export default function SiteApp() {
  return <ClientApp />;
}
