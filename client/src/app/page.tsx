"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else if (user.role === "lecturer") router.replace("/lecturers");
    else router.replace("/students");
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted">Redirecting…</p>
    </div>
  );
}