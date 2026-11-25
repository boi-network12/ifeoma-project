// (students)/layout.tsx
"use client";
import { useState } from "react";
import { ProtectedRoute } from "../_components/ProtectedRoute";
import { StudentTopbar } from "../_components/StudentTopbar";
import { StudentSidebar } from "../_components/StudentSidebar";
import { StudentMobileDrawer } from "../_components/StudentMobileDrawer";


export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        <StudentSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <StudentTopbar onMenuClick={() => setMenuOpen(true)} />
          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </div>
        <StudentMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </ProtectedRoute>
  );
}