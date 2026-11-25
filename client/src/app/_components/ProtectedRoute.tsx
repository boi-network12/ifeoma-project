"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role, useUser } from "@/context/UserContext";

export function ProtectedRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      // Wrong role → send to their own dashboard
      router.replace(user.role === "lecturer" ? "/lecturers" : "/students");
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return <div className="p-8 text-muted">Loading…</div>;
  }
  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}