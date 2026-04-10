import { getBlogs, getCategories, getCourses, type CourseApi } from "@/lib/api";

const accents = [
  "from-[#0066FF] to-blue-600",
  "from-sky-500 to-[#0066FF]",
  "from-indigo-500 to-[#0066FF]",
  "from-amber-500 to-orange-500",
] as const;

export default async function AdminDashboardPage() {
  const results = await Promise.allSettled([getCourses(), getCategories(), getBlogs()]);

  const courses: CourseApi[] = results[0].status === "fulfilled" ? results[0].value : [];
  const categories = results[1].status === "fulfilled" ? results[1].value : [];
  const blogs = results[2].status === "fulfilled" ? results[2].value : [];

  const apiDown = results.some((r) => r.status === "rejected");

  const stats = [
    {
      label: "Total courses",
      value: String(courses.length),
      hint: "From /api/courses/",
      accent: accents[0],
    },
    {
      label: "Categories",
      value: String(categories.length),
      hint: "From /api/categories/",
      accent: accents[1],
    },
    {
      label: "Blog posts",
      value: String(blogs.length),
      hint: "From /api/blog/",
      accent: accents[2],
    },
    {
      label: "Auth users",
      value: "—",
      hint: "Manage staff in Django admin",
      accent: accents[3],
    },
  ];

  const recent = [...courses].slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-navy)]">
          Welcome back
        </h2>
        <p className="mt-1 text-[var(--admin-muted)]">
          Counts refresh on each load. Add or edit content on the Courses page or in Django admin.
        </p>
        {apiDown ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Some API calls failed. Run Django on <code className="text-xs">127.0.0.1:8000</code> or set{" "}
            <code className="text-xs">NEXT_PUBLIC_API_BASE_URL</code>.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white shadow-md shadow-[#0a2540]/[0.04]"
          >
            <div className={`h-1.5 bg-gradient-to-r ${s.accent}`} />
            <div className="p-5">
              <p className="text-sm font-semibold text-[var(--admin-muted)]">{s.label}</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--admin-navy)]">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.hint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 shadow-md shadow-[#0a2540]/[0.04] lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Recent courses
          </h3>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-muted)]">No courses in the API yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {recent.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                  <div>
                    <p className="font-semibold text-slate-900">{c.title}</p>
                    <p className="text-xs text-slate-500">
                      {c.duration} · {c.price} · ★ {Number(c.rating).toFixed(1)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--admin-bg-soft)] px-2 py-0.5 font-mono text-[11px] text-slate-600 ring-1 ring-[var(--admin-border)]">
                    {c.slug}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-[#e8f4ff] to-white p-6 shadow-md shadow-blue-900/5">
          <h3 className="text-sm font-bold text-[var(--admin-navy)]">Dynamic data</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            This dashboard reads your Django REST API. New courses added here or in admin appear in the counts and
            recent list automatically after navigation or refresh.
          </p>
        </div>
      </div>
    </div>
  );
}

