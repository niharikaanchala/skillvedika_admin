"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createCourseAction,
  createCourseInitialState,
  type CreateCourseState,
} from "./actions";
import type { CategoryApi } from "@/lib/api";

type Props = {
  categories: CategoryApi[];
};

export default function AddCourseForm({ categories }: Props) {
  const [state, formAction, pending] = useActionState<CreateCourseState, FormData>(
    createCourseAction,
    createCourseInitialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        Add at least one <strong>category</strong> in Django admin or via API before creating courses.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Add course</h3>
      <p className="mt-1 text-sm text-[var(--admin-muted)]">
        Saves to the same API the public site uses—new courses appear everywhere after refresh.
      </p>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        {state.error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 whitespace-pre-wrap break-words">
            {state.error}
          </div>
        ) : null}
        {state.ok ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
            Course created successfully.
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-xs font-medium text-slate-600">
              Title *
            </label>
            <input
              id="title"
              name="title"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
              placeholder="e.g. React.js Masterclass"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-xs font-medium text-slate-600">
              Slug (optional)
            </label>
            <input
              id="slug"
              name="slug"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
              placeholder="auto from title if empty"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-slate-600">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-xs font-medium text-slate-600">
              Duration *
            </label>
            <input
              id="duration"
              name="duration"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
              placeholder="e.g. 3 Months"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-xs font-medium text-slate-600">
              Price *
            </label>
            <input
              id="price"
              name="price"
              required
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
              placeholder="e.g. ₹25,000"
            />
          </div>
          <div>
            <label htmlFor="rating" className="block text-xs font-medium text-slate-600">
              Rating (0–5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              defaultValue={4.5}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-xs font-medium text-slate-600">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)] focus:ring-2"
              placeholder="Course summary for listings"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[var(--admin-accent)] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[var(--admin-accent-hover)] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Create course"}
        </button>
      </form>
    </div>
  );
}
