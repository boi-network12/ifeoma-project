"use client";

import { Menu } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function LecturerTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useUser();
  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-background md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-muted text-xs">Signed in as</p>
        <p className="truncate text-sm font-medium">{user?.name ?? "Lecturer"}</p>
      </div>
    </header>
  );
}