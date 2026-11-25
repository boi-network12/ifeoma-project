"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const links = [
  { href: "/students", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students/results", label: "My Results", icon: GraduationCap },
  { href: "/students/courses", label: "Courses", icon: BookOpen },
  { href: "/students/profile", label: "Profile", icon: User },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1 px-2">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-background"
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

export function StudentSidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
        <div className="px-4 py-5">
          <p className="font-display text-lg font-bold">Acadex</p>
          <p className="text-muted text-xs">Student Portal</p>
        </div>
        <div className="flex-1">
          <NavLinks />
        </div>
        <div className="border-t border-border p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile trigger — rendered in the topbar instead via MobileMenuButton below */}

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div>
                <p className="font-display font-bold">Acadex</p>
                <p className="text-muted text-xs">Student Portal</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Exported for the topbar — opens the drawer by toggling a shared class trick.
 *  Simpler: lift `open` state to layout. See layout below. */
export { Menu as MenuIcon };