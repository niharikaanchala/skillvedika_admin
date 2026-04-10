/**
 * Django base URL (no trailing slash).
 *
 * - Set `NEXT_PUBLIC_API_BASE_URL` when the API is on another origin in production.
 * - If unset: **server** (SSR/RSC) uses `INTERNAL_API_URL` or `http://127.0.0.1:8000` (Node cannot fetch relative URLs).
 * - **Browser** uses relative `/api/...` so Next.js `rewrites` proxy to Django — avoids CORS when the admin UI is on :3001.
 */
const ENV_API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const DEFAULT_SERVER_API = (process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000").replace(
  /\/$/,
  "",
);

function apiOrigin(): string {
  if (ENV_API_BASE) return ENV_API_BASE;
  if (typeof window === "undefined") return DEFAULT_SERVER_API;
  return "";
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = apiOrigin();
  return origin ? `${origin}${p}` : p;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export type CategoryApi = {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string | null;
};

export type CourseApi = {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  rating: number;
  category: number;
};

export type BlogPostApi = {
  id: number;
  slug: string;
  category: string;
  title: string;
  author: string;
  date: string;
  read_time: string;
  excerpt: string;
};

export async function getCategories(): Promise<CategoryApi[]> {
  return fetchJson<CategoryApi[]>("/api/categories/");
}

export async function getCourses(): Promise<CourseApi[]> {
  return fetchJson<CourseApi[]>("/api/courses/");
}

export async function getBlogs(): Promise<BlogPostApi[]> {
  return fetchJson<BlogPostApi[]>("/api/blog/");
}

export async function createCourseApi(body: {
  title: string;
  slug: string;
  description: string;
  duration: string;
  price: string;
  rating: number;
  category: number;
}): Promise<CourseApi> {
  return fetchJson<CourseApi>("/api/courses/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
