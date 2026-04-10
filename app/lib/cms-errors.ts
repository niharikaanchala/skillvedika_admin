export function parseApiError(body: unknown): string {
  if (!body || typeof body !== "object") return "Request failed.";
  const o = body as {
    detail?: unknown;
    non_field_errors?: string[];
    [k: string]: unknown;
  };
  const d = o.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0] != null) return String(d[0]);
  if (o.non_field_errors?.[0]) return o.non_field_errors[0];

  // DRF field errors commonly come back as: { field: ["message"] }
  for (const [key, val] of Object.entries(o)) {
    if (key === "detail" || key === "non_field_errors") continue;
    if (Array.isArray(val) && val[0] != null) return `${key}: ${String(val[0])}`;
    if (typeof val === "string") return `${key}: ${val}`;
  }
  return "Request failed.";
}
