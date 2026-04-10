import type { ReactNode } from "react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

type Props = {
  children: ReactNode;
};

export default function ShellLayout({ children }: Props) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="ml-64 flex min-h-screen flex-1 flex-col">
          <Navbar />
          <main className="flex-1 bg-[var(--admin-bg)] p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
