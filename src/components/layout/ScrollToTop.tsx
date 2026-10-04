import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    // The target page may not be mounted yet (AnimatePresence waits for the old page's exit),
    // so poll briefly for the anchor before giving up and scrolling to top.
    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    const started = performance.now();
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (performance.now() - started < 1500) {
        frame = requestAnimationFrame(tryScroll);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    tryScroll();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
