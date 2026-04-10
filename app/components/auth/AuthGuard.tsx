"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN_KEY } from "@/lib/auth";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      router.replace("/admin");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)] text-sm text-[var(--admin-muted)]">
        Verifying session…
      </div>
    );
  }

  return <>{children}</>;
}
