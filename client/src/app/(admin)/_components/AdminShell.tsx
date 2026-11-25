"use client";

import { useState } from "react";
import { AdminTopbar } from "./AdminTopbar";
import { AdminSidebar, AdminMobileDrawer } from "./AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setMenuOpen(true)} />
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
      <AdminMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}