"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLoginForm from "./AdminLoginForm";
import { ACCESS_TOKEN_KEY } from "@/lib/auth";

export default function AdminEntryPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
      router.replace("/admin/dashboard");
      return;
    }
    setShowLogin(true);
  }, [router]);

  if (!showLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg)] text-sm text-[var(--admin-muted)]">
        Loading…
      </div>
    );
  }

  return <AdminLoginForm />;
}
