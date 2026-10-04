import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Public pages are prerendered at build time (scripts/prerender.mjs): hydrate that HTML when it was rendered
// for this exact URL. Otherwise (404.html served for a missing URL, the empty admin shell, `npm run dev`)
// render from scratch — createRoot replaces whatever markup is in #root.
const path = window.location.pathname.replace(/\/+$/, '') || '/'
if (container.hasChildNodes() && container.dataset.prerendered === path) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
