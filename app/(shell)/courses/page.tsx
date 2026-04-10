import AddCourseForm from "./AddCourseForm";
import type { CourseApi } from "@/lib/api";
import { getCategories, getCourses } from "@/lib/api";

async function loadData(): Promise<{
  courses: CourseApi[];
  categories: Awaited<ReturnType<typeof getCategories>>;
  loadError: string | null;
}> {
  const results = await Promise.allSettled([getCourses(), getCategories()]);
  const courses = results[0].status === "fulfilled" ? results[0].value : [];
  const categories = results[1].status === "fulfilled" ? results[1].value : [];
  const loadError =
    results[0].status === "rejected" || results[1].status === "rejected"
      ? "Could not reach the API. Start Django on port 8000 or set NEXT_PUBLIC_API_BASE_URL."
      : null;
  return { courses, categories, loadError };
}

export default async function AdminCoursesPage() {
  const { courses, categories, loadError } = await loadData();
  const catNames = new Map(categories.map((c) => [c.id, c.name] as const));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-navy)]">Courses</h2>
        <p className="mt-1 text-[var(--admin-muted)]">
          Live list from <code className="rounded bg-slate-100 px-1 text-xs">GET /api/courses/</code>. Add courses
          below or in Django admin.
        </p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{loadError}</div>
      ) : null}

      <AddCourseForm categories={categories} />

      <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white shadow-md shadow-[#0a2540]/[0.04]">
        <div className="border-b border-[var(--admin-border)] bg-[var(--admin-bg-soft)] px-5 py-4">
          <h3 className="font-bold text-[var(--admin-navy)]">All courses ({courses.length})</h3>
        </div>
        <div className="overflow-x-auto">
          {courses.length === 0 ? (
            <p className="p-8 text-center text-sm text-[var(--admin-muted)]">No courses yet. Create one above.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Slug</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3 font-medium text-slate-900">{row.title}</td>
                    <td className="px-5 py-3 text-slate-600">{catNames.get(row.category) ?? row.category}</td>
                    <td className="px-5 py-3 text-slate-600">{row.duration}</td>
                    <td className="px-5 py-3 text-slate-600">{row.price}</td>
                    <td className="px-5 py-3 text-slate-600">{Number(row.rating).toFixed(1)}</td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{row.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
