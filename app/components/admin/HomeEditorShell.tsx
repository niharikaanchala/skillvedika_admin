import type { ReactNode } from "react";

export function HomeEditorShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16">
      <header className="border-b border-[var(--admin-border)] pb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--admin-accent)]">
          Home · CMS
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--admin-navy)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--admin-muted)]">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

export function EditorPanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[var(--admin-border)] bg-white p-6 shadow-md shadow-[#0a2540]/[0.06] ${className}`}
    >
      {title ? (
        <h2 className="mb-5 border-b border-slate-100 pb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export const fieldLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600";
export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20";
export const textareaClass = `${inputClass} min-h-[88px] resize-y font-sans`;
export const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--admin-accent)] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-[var(--admin-accent-hover)] disabled:cursor-not-allowed disabled:opacity-45";
export const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:opacity-45";
export const btnDanger =
  "inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100";
