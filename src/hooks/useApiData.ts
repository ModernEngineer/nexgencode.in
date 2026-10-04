import { useEffect, useState } from 'react';

/**
 * Loads data from the API once on mount. While loading, `data` is null (render a skeleton);
 * if the request fails, `data` falls back to `fallback` so the public site never shows an empty section.
 */
export function useApiData<T>(fetcher: (signal: AbortSignal) => Promise<T>, fallback: T) {
  const [state, setState] = useState<{ data: T | null; error: boolean }>({ data: null, error: false });

  useEffect(() => {
    const controller = new AbortController();
    fetcher(controller.signal)
      .then((data) => setState({ data, error: false }))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setState({ data: fallback, error: true });
      });
    return () => controller.abort();
    // fetcher/fallback are module-level in every caller; load once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data: state.data, loading: state.data === null, error: state.error };
}
