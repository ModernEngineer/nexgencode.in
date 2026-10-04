// Thin fetch wrapper for the NexGenCode .NET API (backend/NexGenCode.Api).
// Dev: requests go to /api on the Vite server, which proxies to http://localhost:5080 (see vite.config.ts).
// Prod: set VITE_API_URL to the deployed API origin, e.g. https://api.nexgencode.in

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const TOKEN_KEY = 'ngc_admin_token';

export const tokenStore = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable — session lasts until reload */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Fired when an authenticated request gets 401 so the admin app can log out. */
export const UNAUTHORIZED_EVENT = 'ngc:unauthorized';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

export async function api<T>(path: string, { method = 'GET', body, auth = false, signal }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError(0, 'Could not reach the server. Please check your connection and try again.');
  }

  if (res.status === 401 && auth) {
    tokenStore.clear();
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!res.ok) {
    let message = res.status === 429 ? 'Too many requests — please wait a few minutes and try again.' : `Request failed (${res.status})`;
    let errors: Record<string, string[]> | undefined;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      else if (data?.title) message = data.title;
      errors = data?.errors;
      if (errors) message = Object.values(errors).flat()[0] ?? message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, message, errors);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Resolves image URLs returned by the API (/uploads/...) against the API origin. */
export function assetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  return url.startsWith('/uploads/') ? `${API_BASE}${url}` : url;
}
