"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HomeEditorShell, EditorPanel, btnPrimary, fieldLabel, inputClass, textareaClass } from "@/components/admin/HomeEditorShell";
import { apiUrl } from "@/lib/api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, authHeadersJson, getAccessToken } from "@/lib/auth";
import { parseApiError } from "@/lib/cms-errors";

type SeoForm = {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

const emptySeo: SeoForm = {
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
};

export default function AdminHomeSeoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<SeoForm>(emptySeo);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/home/hero/"), { cache: "no-store" });
      if (!res.ok) throw new Error("load");
      const data = (await res.json()) as Record<string, unknown>;
      setForm({
        meta_title: typeof data.meta_title === "string" ? data.meta_title : "",
        meta_description: typeof data.meta_description === "string" ? data.meta_description : "",
        meta_keywords: typeof data.meta_keywords === "string" ? data.meta_keywords : "",
      });
    } catch {
      setError("Could not load SEO data. Create Home Hero section first.");
      setForm(emptySeo);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/admin");
      return;
    }
    void load();
  }, [load, router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!getAccessToken()) {
      router.replace("/admin");
      return;
    }
    setSaving(true);
    try {
      let res = await fetch(apiUrl("/api/home/hero/"), {
        method: "PATCH",
        headers: authHeadersJson(),
        body: JSON.stringify({
          meta_title: form.meta_title.trim(),
          meta_description: form.meta_description.trim(),
          meta_keywords: form.meta_keywords.trim(),
        }),
      });

      if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          res = await fetch(apiUrl("/api/home/hero/"), {
            method: "PATCH",
            headers: authHeadersJson(),
            body: JSON.stringify({
              meta_title: form.meta_title.trim(),
              meta_description: form.meta_description.trim(),
              meta_keywords: form.meta_keywords.trim(),
            }),
          });
        }
      }
      if (res.status === 401) {
        setError("Session expired. Please sign in again.");
        router.replace("/admin");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(parseApiError(body));
        return;
      }
      setMessage("Home SEO saved successfully.");
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) return false;
    try {
      const res = await fetch(apiUrl("/api/token/refresh/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) return false;
      const data = (await res.json().catch(() => ({}))) as { access?: string };
      if (!data.access) return false;
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
      return true;
    } catch {
      return false;
    }
  }

  if (loading) {
    return (
      <HomeEditorShell title="Home SEO" subtitle="Loading...">
        <p className="text-sm text-slate-500">Loading...</p>
      </HomeEditorShell>
    );
  }

  return (
    <HomeEditorShell
      title="Home SEO"
      subtitle="Set dynamic home page meta title, description and keywords."
    >
      {message ? <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{message}</p> : null}
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}

      <EditorPanel title="SEO Metadata">
        <form className="space-y-4" onSubmit={onSave}>
          <div>
            <label className={fieldLabel}>Meta Title</label>
            <input
              className={inputClass}
              value={form.meta_title}
              onChange={(e) => setForm((p) => ({ ...p, meta_title: e.target.value }))}
              placeholder="SkillVedika | Online Courses"
            />
          </div>
          <div>
            <label className={fieldLabel}>Meta Description</label>
            <textarea
              className={textareaClass}
              rows={4}
              value={form.meta_description}
              onChange={(e) => setForm((p) => ({ ...p, meta_description: e.target.value }))}
              placeholder="Home page SEO description..."
            />
          </div>
          <div>
            <label className={fieldLabel}>Meta Keywords (comma-separated)</label>
            <input
              className={inputClass}
              value={form.meta_keywords}
              onChange={(e) => setForm((p) => ({ ...p, meta_keywords: e.target.value }))}
              placeholder="online courses, skill training, job support"
            />
          </div>
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? "Saving..." : "Save SEO"}
          </button>
        </form>
      </EditorPanel>
    </HomeEditorShell>
  );
}

