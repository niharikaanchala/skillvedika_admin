"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/home/HeroSection";
import { apiUrl } from "@/lib/api";
import { authHeadersJson, authHeadersMultipart, getAccessToken } from "@/lib/auth";

type HeroForm = {
  id?: number;
  heading: string;
  subheading: string;
  cta_text: string;
  cta_link: string;
  highlights: string;
  popular_tags: string;
  right_card_title: string;
  right_card_subtitle: string;
  search_placeholder: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  image: string | null;
};

const emptyForm = (): HeroForm => ({
  heading: "",
  subheading: "",
  cta_text: "Get Started",
  cta_link: "",
  highlights: "",
  popular_tags: "",
  right_card_title: "",
  right_card_subtitle: "",
  search_placeholder: "",
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  image: null,
});

function formFromApi(json: Record<string, unknown>): HeroForm {
  if (typeof json.heading !== "string" || !json.heading.trim()) {
    return emptyForm();
  }
  return {
    id: typeof json.id === "number" ? json.id : undefined,
    heading: String(json.heading),
    subheading: typeof json.subheading === "string" ? json.subheading : "",
    cta_text: typeof json.cta_text === "string" ? json.cta_text : "Get Started",
    cta_link: typeof json.cta_link === "string" ? json.cta_link : "",
    highlights: typeof json.highlights === "string" ? json.highlights : "",
    popular_tags: typeof json.popular_tags === "string" ? json.popular_tags : "",
    right_card_title: typeof json.right_card_title === "string" ? json.right_card_title : "",
    right_card_subtitle: typeof json.right_card_subtitle === "string" ? json.right_card_subtitle : "",
    search_placeholder: typeof json.search_placeholder === "string" ? json.search_placeholder : "",
    meta_title: typeof json.meta_title === "string" ? json.meta_title : "",
    meta_description: typeof json.meta_description === "string" ? json.meta_description : "",
    meta_keywords: typeof json.meta_keywords === "string" ? json.meta_keywords : "",
    image: typeof json.image === "string" ? json.image : null,
  };
}

function parseError(res: unknown): string {
  if (!res || typeof res !== "object") return "Save failed.";
  const o = res as { detail?: unknown; non_field_errors?: string[] };
  const d = o.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d[0]) return String(d[0]);
  if (o.non_field_errors?.[0]) return o.non_field_errors[0];
  return "Save failed.";
}

export default function AdminHeroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<HeroForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/home/hero/"));
      if (!res.ok) throw new Error("Failed to load hero");
      const json = (await res.json()) as Record<string, unknown>;
      setForm(formFromApi(json));
    } catch {
      setError("Could not load hero from the API.");
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
    const url = apiUrl("/api/home/hero/");
    const isUpdate = form.id != null;

    const jsonBody = {
      heading,
      subheading: form.subheading.trim(),
      cta_text: form.cta_text.trim() || "Get Started",
      cta_link: form.cta_link.trim() || null,
      highlights: form.highlights.trim(),
      popular_tags: form.popular_tags.trim(),
      right_card_title: form.right_card_title.trim(),
      right_card_subtitle: form.right_card_subtitle.trim(),
      search_placeholder: form.search_placeholder.trim(),
      meta_title: form.meta_title.trim(),
      meta_description: form.meta_description.trim(),
      meta_keywords: form.meta_keywords.trim(),
    };

    try {
      let res: Response;

      if (imageFile) {
        const fd = new FormData();
        fd.append("heading", heading);
        fd.append("subheading", form.subheading.trim());
        fd.append("cta_text", form.cta_text.trim() || "Get Started");
        fd.append("cta_link", form.cta_link.trim());
        fd.append("highlights", form.highlights.trim());
        fd.append("popular_tags", form.popular_tags.trim());
        fd.append("right_card_title", form.right_card_title.trim());
        fd.append("right_card_subtitle", form.right_card_subtitle.trim());
        fd.append("search_placeholder", form.search_placeholder.trim());
        fd.append("meta_title", form.meta_title.trim());
        fd.append("meta_description", form.meta_description.trim());
        fd.append("meta_keywords", form.meta_keywords.trim());
        fd.append("image", imageFile);
        res = await fetch(url, {
          method: isUpdate ? "PATCH" : "POST",
          headers: authHeadersMultipart(),
          body: fd,
        });
      } else {
        res = await fetch(url, {
          method: isUpdate ? "PATCH" : "POST",
          headers: authHeadersJson(),
          body: JSON.stringify(jsonBody),
        });
      }

      if (res.status === 401) {
        router.replace("/admin");
        return;
      }

      if (res.status === 409 && !isUpdate) {
        await load();
        setError("Hero already exists — form refreshed. Save again to update.");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(parseError(body));
        return;
      }

      const saved = (await res.json()) as Record<string, unknown>;
      setForm(formFromApi(saved));
      setImageFile(null);
      setMessage("Saved. The public home page reads this from the API (no-store).");
    } catch {
      setError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--admin-muted)]">Loading hero…</p>;
  }

  const preview = {
    heading: form.heading,
    subheading: form.subheading || undefined,
    cta_text: form.cta_text || undefined,
    cta_link: form.cta_link || null,
    image: form.image,
    highlights: form.highlights || undefined,
    popular_tags: form.popular_tags || undefined,
    right_card_title: form.right_card_title || undefined,
    right_card_subtitle: form.right_card_subtitle || undefined,
    search_placeholder: form.search_placeholder || undefined,
  };

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 placeholder:text-slate-400";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--admin-navy)]">Hero section</h1>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          All fields below are stored in Django and rendered on the public home page. Leave optional fields empty to
          hide those blocks.
        </p>
      </div>

      {message ? (
        <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-[var(--admin-border)] bg-white p-6 shadow-md shadow-[#0a2540]/[0.04]"
      >
        <div>
          <label htmlFor="hero-heading" className="mb-1 block text-sm font-semibold text-slate-700">
            Heading <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="hero-heading"
            value={form.heading}
            onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))}
            rows={4}
            className={field}
            placeholder="Line 1&#10;Line 2 (accent) — or use a period to split"
            required
          />
        </div>

        <div>
          <label htmlFor="hero-sub" className="mb-1 block text-sm font-semibold text-slate-700">
            Subheading
          </label>
          <textarea
            id="hero-sub"
            value={form.subheading}
            onChange={(e) => setForm((f) => ({ ...f, subheading: e.target.value }))}
            rows={2}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="hero-highlights" className="mb-1 block text-sm font-semibold text-slate-700">
            Highlights (one per line; include any symbols in the text)
          </label>
          <textarea
            id="hero-highlights"
            value={form.highlights}
            onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
            rows={4}
            className={`${field} font-mono`}
          />
        </div>

        <div>
          <label htmlFor="hero-tags" className="mb-1 block text-sm font-semibold text-slate-700">
            Popular tags (comma-separated)
          </label>
          <input
            id="hero-tags"
            value={form.popular_tags}
            onChange={(e) => setForm((f) => ({ ...f, popular_tags: e.target.value }))}
            className={field}
            placeholder="Snowflake, SAP FICO, …"
          />
        </div>

        <div>
          <label htmlFor="hero-search-ph" className="mb-1 block text-sm font-semibold text-slate-700">
            Search placeholder (empty = hide search row)
          </label>
          <input
            id="hero-search-ph"
            value={form.search_placeholder}
            onChange={(e) => setForm((f) => ({ ...f, search_placeholder: e.target.value }))}
            className={field}
          />
        </div>

        <div>
          <label htmlFor="hero-meta-title" className="mb-1 block text-sm font-semibold text-slate-700">
            Meta title (Home page SEO)
          </label>
          <input
            id="hero-meta-title"
            value={form.meta_title}
            onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
            className={field}
            placeholder="SkillVedika | Online Courses and Training"
          />
        </div>

        <div>
          <label htmlFor="hero-meta-description" className="mb-1 block text-sm font-semibold text-slate-700">
            Meta description
          </label>
          <textarea
            id="hero-meta-description"
            value={form.meta_description}
            onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
            rows={3}
            className={field}
            placeholder="Short SEO description for home page."
          />
        </div>

        <div>
          <label htmlFor="hero-meta-keywords" className="mb-1 block text-sm font-semibold text-slate-700">
            Meta keywords (comma-separated)
          </label>
          <input
            id="hero-meta-keywords"
            value={form.meta_keywords}
            onChange={(e) => setForm((f) => ({ ...f, meta_keywords: e.target.value }))}
            className={field}
            placeholder="online courses, job support, web development"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hero-card-title" className="mb-1 block text-sm font-semibold text-slate-700">
              Right card title (when no image)
            </label>
            <input
              id="hero-card-title"
              value={form.right_card_title}
              onChange={(e) => setForm((f) => ({ ...f, right_card_title: e.target.value }))}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="hero-card-sub" className="mb-1 block text-sm font-semibold text-slate-700">
              Right card subtitle
            </label>
            <textarea
              id="hero-card-sub"
              value={form.right_card_subtitle}
              onChange={(e) => setForm((f) => ({ ...f, right_card_subtitle: e.target.value }))}
              rows={2}
              className={field}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hero-cta-text" className="mb-1 block text-sm font-semibold text-slate-700">
              CTA label
            </label>
            <input
              id="hero-cta-text"
              value={form.cta_text}
              onChange={(e) => setForm((f) => ({ ...f, cta_text: e.target.value }))}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="hero-cta-link" className="mb-1 block text-sm font-semibold text-slate-700">
              CTA link (URL)
            </label>
            <input
              id="hero-cta-link"
              type="url"
              value={form.cta_link}
              onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))}
              className={field}
              placeholder="https://…"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hero-image" className="mb-1 block text-sm font-semibold text-slate-700">
            Hero image
          </label>
          <input
            id="hero-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-[var(--admin-accent)] file:px-3 file:py-2 file:text-white file:font-semibold"
          />
          <p className="mt-1 text-xs text-slate-500">Leave unchanged to keep the current image.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--admin-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--admin-accent-hover)] disabled:opacity-50"
        >
          {saving ? "Saving…" : form.id != null ? "Save changes" : "Create hero"}
        </button>
      </form>

      <div>
        <h2 className="mb-3 text-lg font-bold text-[var(--admin-navy)]">Preview</h2>
        <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-white text-slate-900 shadow-md">
          <HeroSection data={preview} />
        </div>
      </div>
    </div>
  );
}
