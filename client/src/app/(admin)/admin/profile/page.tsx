"use client";

import { useUser } from "@/context/UserContext";
import { mockAdmin } from "@/lib/mockAdmin";
import { ShieldCheck, IdCard } from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useUser();
  const initials = (user?.name ?? "A")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-muted text-sm">Administrator account</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-semibold">{user?.name ?? "Administrator"}</p>
          <p className="text-muted text-sm flex items-center gap-1 font-mono text-xs mt-1">
            <IdCard className="h-3 w-3" /> {mockAdmin.staffNo}
          </p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          <ShieldCheck className="h-3 w-3" /> Admin
        </span>
      </div>

      <section className="rounded-xl border border-border bg-surface">
        <header className="border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold">System access</h2>
        </header>
        <dl className="divide-y divide-border">
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-muted">Students registered</dt>
            <dd className="font-medium tabular">{mockAdmin.students.length}</dd>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-muted">Lecturers registered</dt>
            <dd className="font-medium tabular">{mockAdmin.lecturers.length}</dd>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-muted">Account status</dt>
            <dd className="font-medium text-accent">Active</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}