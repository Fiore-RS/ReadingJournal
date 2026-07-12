export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// The API serves uploaded images from its own origin (e.g. http://localhost:4000),
// not under /api — this strips the /api suffix to get that origin.
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// Turns a relative path like "/uploads/covers/xyz.jpg" (returned by the backend)
// into a full URL the browser can load. Leaves absolute URLs untouched.
export function resolveMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path}`;
}

export class ApiRequestError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

// The current session token, kept in memory and mirrored to localStorage so
// it survives a page refresh. AuthContext is the only thing that should
// call setAuthToken — everything else just calls apiFetch as before and
// gets the header applied automatically.
const TOKEN_STORAGE_KEY = "readingJournal.token";
let authToken: string | null = localStorage.getItem(TOKEN_STORAGE_KEY);

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// AuthContext registers itself here so apiFetch can force a logout when the
// backend says the session is no longer valid (expired/invalid token),
// without api.ts needing to know anything about React.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      onUnauthorized?.();
    }
    throw new ApiRequestError(res.status, body?.error || `Request failed with ${res.status}`, body?.details);
  }

  return body as T;
}
