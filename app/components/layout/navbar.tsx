"use client";

import { useRouter } from "next/navigation";
import { clearStoredTokens } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    clearStoredTokens();
    router.replace("/admin");
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--admin-border)] bg-white/95 px-6 shadow-sm backdrop-blur-sm">
      <div className="hidden text-sm font-semibold text-[var(--admin-navy)] md:block">
        Control center
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg-soft)] px-4 py-2 text-sm text-[var(--admin-muted)] md:block md:min-w-[200px]">
          <span className="text-slate-400">Search…</span>
        </div>
        <button
          type="button"
          className="rounded-xl border border-[var(--admin-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--admin-navy)] shadow-sm transition hover:border-[var(--admin-accent)]/40 hover:bg-[var(--admin-bg-soft)]"
        >
          Profile
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
