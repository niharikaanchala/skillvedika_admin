"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";
import { authHeadersJson, getAccessToken } from "@/lib/auth";
import { parseApiError } from "@/lib/cms-errors";
import { HomeEditorShell, EditorPanel, btnPrimary, fieldLabel, inputClass, textareaClass } from "@/components/admin/HomeEditorShell";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url";
  required?: boolean;
  placeholder?: string;
};

type Props = {
  title: string;
  subtitle: string;
  listEndpoint: string;
  fields: FieldDef[];
};

type JsonRec = Record<string, unknown>;

function toStringValue(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export default function SingletonCmsEditor({ title, subtitle, listEndpoint, fields }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [entityId, setEntityId] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const initialForm = useMemo(
    () =>
      fields.reduce<Record<string, string>>((acc, f) => {
        acc[f.key] = "";
        return acc;
      }, {}),
    [fields]
  );

  const fromApi = useCallback(
    (json: JsonRec | null) => {
      const base = { ...initialForm };
      if (!json) return base;
      for (const f of fields) {
        base[f.key] = toStringValue(json[f.key]);
      }
      return base;
    },
    [fields, initialForm]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl(listEndpoint), { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      const payload = (await res.json()) as unknown;
      const first = Array.isArray(payload) ? ((payload[0] ?? null) as JsonRec | null) : (payload as JsonRec);
      const id = first && typeof first.id === "number" ? first.id : null;
      setEntityId(id);
      setForm(fromApi(first));
    } catch {
      setEntityId(null);
      setForm(initialForm);
      setError("Could not load section data.");
    } finally {
      setLoading(false);
    }
  }, [fromApi, initialForm, listEndpoint]);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/admin");
      return;
    }
    void load();
  }, [load, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!getAccessToken()) {
      router.replace("/admin");
      return;
    }

    for (const f of fields) {
      if (f.required && !form[f.key]?.trim()) {
        setError(`${f.label} is required.`);
        return;
      }
    }

    const cleanedBody = fields.reduce<Record<string, string | null>>((acc, f) => {
      const value = (form[f.key] ?? "").trim();
      acc[f.key] = value === "" ? null : value;
      return acc;
    }, {});

    setSaving(true);
    try {
      const updateUrl = entityId ? `${listEndpoint}${entityId}/` : listEndpoint;
      const res = await fetch(apiUrl(updateUrl), {
        method: entityId ? "PUT" : "POST",
        headers: authHeadersJson(),
        body: JSON.stringify(cleanedBody),
      });
      if (res.status === 401) {
        router.replace("/admin");
        return;
      }
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        setError(parseApiError(errBody));
        return;
      }
      const saved = (await res.json()) as JsonRec;
      setEntityId(typeof saved.id === "number" ? saved.id : entityId);
      setForm(fromApi(saved));
      setMessage("Saved successfully. Public page will read updated data dynamically.");
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <HomeEditorShell title={title} subtitle="Loading...">
        <p className="text-sm text-slate-500">Loading...</p>
      </HomeEditorShell>
    );
  }

  return (
    <HomeEditorShell title={title} subtitle={subtitle}>
      {message ? <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">{message}</p> : null}
      {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p> : null}
      <EditorPanel title="Edit content">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={f.key} className={fieldLabel}>
                {f.label}
                {f.required ? <span className="text-rose-500"> *</span> : null}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={f.key}
                  rows={4}
                  className={textareaClass}
                  placeholder={f.placeholder}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              ) : (
                <input
                  id={f.key}
                  type={f.type === "url" ? "url" : "text"}
                  className={inputClass}
                  placeholder={f.placeholder}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? "Saving..." : entityId ? "Save changes" : "Create section"}
          </button>
        </form>
      </EditorPanel>
    </HomeEditorShell>
  );
}
