"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SupportSectionComponent from "@/components/home/SupportSection";
import {
  HomeEditorShell,
  EditorPanel,
  fieldLabel,
  inputClass,
  textareaClass,
  btnPrimary,
} from "@/components/admin/HomeEditorShell";
import { apiUrl } from "@/lib/api";
import { authHeadersJson, getAccessToken } from "@/lib/auth";
import { parseApiError } from "@/lib/cms-errors";

type SupportForm = {
  id?: number;
  heading: string;
  plan_tabs: string;
  cta_text: string;
  cta_link: string;
};

const emptyForm = (): SupportForm => ({
  heading: "",
  plan_tabs: "",
  cta_text: "",
  cta_link: "",
});

function fromApi(json: Record<string, unknown>): SupportForm {
  if (typeof json.heading !== "string" || !json.heading.trim()) {
    return emptyForm();
  }
  return {
    id: typeof json.id === "number" ? json.id : undefined,
    heading: String(json.heading),
    plan_tabs: typeof json.plan_tabs === "string" ? json.plan_tabs : "",
    cta_text: typeof json.cta_text === "string" ? json.cta_text : "",
    cta_link: typeof json.cta_link === "string" ? json.cta_link : "",
  };
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SupportForm>(emptyForm());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/home/support/"));
      if (!res.ok) throw new Error("load");
      const json = (await res.json()) as Record<string, unknown>;
      setForm(fromApi(json));
    } catch {
      setError("Could not load support block.");
      setForm(emptyForm());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/admin");
      return;
    }
    load();
  }, [load, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!getAccessToken()) {
      router.replace("/admin");
      return;
    }
    const heading = form.heading.trim();
    if (!heading) {
      setError("Heading is required.");
      return;
    }
    setSaving(true);
    const url = apiUrl("/api/home/support/");
    const isUpdate = form.id != null;
    const body = {
      heading,
      plan_tabs: form.plan_tabs.trim(),
      cta_text: form.cta_text.trim(),
      cta_link: form.cta_link.trim() || null,
    };
    try {
      const res = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        headers: authHeadersJson(),
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      if (res.status === 409 && !isUpdate) {
        await load();
        setError("Block already exists — form refreshed. Save again to update.");
        return;
      }
      if (!res.ok) {
        setError(parseApiError(await res.json().catch(() => ({}))));
        return;
      }
      const saved = (await res.json()) as Record<string, unknown>;
      setForm(fromApi(saved));
      setMessage("Saved.");
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <HomeEditorShell title="Support" subtitle="Loading…">
        <p className="text-slate-400">Loading…</p>
      </HomeEditorShell>
    );
  }

  const preview = {
    heading: form.heading || " ",
    plan_tabs: form.plan_tabs,
    cta_text: form.cta_text,
    cta_link: form.cta_link || null,
  };

  return (
    <HomeEditorShell
      title="Support section"
      subtitle="Dark band on the home page: heading, optional comma-separated tab labels, and CTA. No hardcoded defaults on the public site."
    >
      {message ? (
        <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>
      ) : null}

      <EditorPanel title="Edit support block">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sup-h" className={fieldLabel}>
              Heading <span className="text-rose-400">*</span>
            </label>
            <input
              id="sup-h"
              value={form.heading}
              onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="sup-tabs" className={fieldLabel}>
              Tab labels (comma-separated, optional)
            </label>
            <textarea
              id="sup-tabs"
              value={form.plan_tabs}
              onChange={(e) => setForm((f) => ({ ...f, plan_tabs: e.target.value }))}
              className={textareaClass}
              rows={2}
              placeholder="e.g. hourly, weekly, monthly"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sup-cta" className={fieldLabel}>
                CTA label
              </label>
              <input
                id="sup-cta"
                value={form.cta_text}
                onChange={(e) => setForm((f) => ({ ...f, cta_text: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="sup-link" className={fieldLabel}>
                CTA URL
              </label>
              <input
                id="sup-link"
                type="url"
                value={form.cta_link}
                onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))}
                className={inputClass}
                placeholder="https://…"
              />
            </div>
          </div>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : form.id != null ? "Save changes" : "Create support block"}
          </button>
        </form>
      </EditorPanel>

      <EditorPanel title="Preview">
        <div className="overflow-hidden rounded-xl border border-slate-600/80">
          {form.heading.trim() ? (
            <SupportSectionComponent data={preview} />
          ) : (
            <p className="bg-slate-900 p-8 text-center text-sm text-slate-500">Add a heading to preview.</p>
          )}
        </div>
      </EditorPanel>
    </HomeEditorShell>
  );
}
