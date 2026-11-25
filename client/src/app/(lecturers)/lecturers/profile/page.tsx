"use client";

import { useUser } from "@/context/UserContext";
import { mockLecturer } from "@/lib/mockLecturer";
import { IdCard, Building2, GraduationCap } from "lucide-react";

export default function LecturerProfilePage() {
  const { user } = useUser();
  const initials = (user?.name ?? "L")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-muted text-sm">Your staff information</p>
      </div>

      <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-semibold">{user?.name ?? "—"}</p>
          <p className="text-muted text-sm">{mockLecturer.rank}</p>
          <p className="text-muted mt-1 flex items-center gap-1 text-xs font-mono">
            <IdCard className="h-3 w-3" /> {mockLecturer.staffNo}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-surface">
        <header className="border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold">Department</h2>
        </header>
        <dl className="divide-y divide-border">
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="flex items-center gap-2 text-muted">
              <Building2 className="h-3.5 w-3.5" /> Department
            </dt>
            <dd className="font-medium">{mockLecturer.department}</dd>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="flex items-center gap-2 text-muted">
              <GraduationCap className="h-3.5 w-3.5" /> Rank
            </dt>
            <dd className="font-medium">{mockLecturer.rank}</dd>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <dt className="text-muted">Courses assigned</dt>
            <dd className="font-medium tabular">{mockLecturer.courses.length}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}