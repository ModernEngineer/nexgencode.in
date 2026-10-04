// SSR entry used only at build time by scripts/prerender.mjs to turn every route into static HTML.
// The browser entry (main.tsx) then hydrates that HTML instead of rendering from scratch.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { allRoutes } from './data/seo';

export const routes = allRoutes.map((r) => r.path);

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}
