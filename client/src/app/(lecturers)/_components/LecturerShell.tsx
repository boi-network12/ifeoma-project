"use client";

import { useState } from "react";
import { LecturerTopbar } from "./LecturerTopbar";
import { LecturerSidebar, LecturerMobileDrawer } from "./LecturerSidebar";

export function LecturerShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <LecturerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <LecturerTopbar onMenuClick={() => setMenuOpen(true)} />
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
      <LecturerMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}