export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-[var(--admin-navy)]">Users</h2>
      <p className="text-[var(--admin-muted)]">
        There is no custom users API in this project yet. Manage Django auth users and staff in{" "}
        <strong>Django admin</strong> (<code className="rounded bg-slate-100 px-1 text-xs">/admin/</code>).
      </p>
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 text-sm text-slate-600 shadow-sm">
        When you add a <code className="text-xs">/api/users/</code> endpoint, this page can list roles and permissions
        here.
      </div>
    </div>
  );
}
