export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/** JSON requests (do not use with `FormData`). */
export function authHeadersJson(): HeadersInit {
  const t = getAccessToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (t) headers.Authorization = `Bearer ${t}`;
  return headers;
}

/** Multipart uploads — omit Content-Type so the browser sets the boundary. */
export function authHeadersMultipart(): HeadersInit {
  const t = getAccessToken();
  if (!t) return {};
  return { Authorization: `Bearer ${t}` };
}

/** DELETE / GET mutations that do not send a body. */
export function authHeadersBearer(): HeadersInit {
  const t = getAccessToken();
  if (!t) return {};
  return { Authorization: `Bearer ${t}` };
}

export function clearStoredTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
