"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  User,
  X,
  LogOut,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

const links = [
  { href: "/lecturers", label: "Dashboard", icon: LayoutDashboard },
  { href: "/lecturers/courses", label: "My Courses", icon: BookOpen },
  { href: "/lecturers/profile", label: "Profile", icon: User },
];

function Brand() {
  return (
    <div>
      <p className="font-display text-lg font-bold">Acadex</p>
      <p className="text-muted text-xs">Lecturer Portal</p>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 px-2">
      {links.map(({ href, label, icon: Icon }) => {
        // "My Courses" stays active while inside /lecturers/courses/[code]
        const active =
          pathname === href || (href !== "/lecturers" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active ? "bg-primary text-primary-foreground" : "hover:bg-background"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton() {
  const { logout } = useUser();
  const router = useRouter();
  return (
    <button
      onClick={() => {
        logout();
        router.replace("/login");
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}

export function LecturerSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
      <div className="px-4 py-5"><Brand /></div>
      <div className="flex-1"><NavLinks /></div>
      <div className="border-t border-border p-2"><LogoutButton /></div>
    </aside>
  );
}

export function LecturerMobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <Brand />
          <button onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <NavLinks onNavigate={onClose} />
        </div>
        <div className="border-t border-border p-2"><LogoutButton /></div>
      </div>
    </div>
  );
}