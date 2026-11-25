"use client";

import Link from "next/link";
import { BookOpen, Users, ClipboardCheck, AlertTriangle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { mockLecturer } from "@/lib/mockLecturer";

export default function LecturersDashboardPage() {
  const { user } = useUser();

  const totals = mockLecturer.courses.reduce(
    (acc, c) => {
      acc.students += c.students.length;
      acc.pending += c.students.filter((s) => s.score === null).length;
      return acc;
    },
    { students: 0, pending: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome, {user?.name?.split(" ")[0] ?? "Lecturer"}
        </h1>
        <p className="text-muted text-sm">
          {mockLecturer.rank} · {mockLecturer.department} · {mockLecturer.staffNo}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Courses", value: mockLecturer.courses.length, icon: BookOpen, hint: "Assigned this session" },
          { label: "Students", value: totals.students, icon: Users, hint: "Across all courses" },
          { label: "Scores entered", value: totals.students - totals.pending, icon: ClipboardCheck, hint: "Complete rows", accent: "accent" as const },
          { label: "Pending scores", value: totals.pending, icon: AlertTriangle, hint: "Needs attention", accent: "destructive" as const },
        ].map(({ label, value, icon: Icon, hint, accent }) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-muted text-xs font-medium uppercase tracking-wide">{label}</p>
              <Icon className="h-4 w-4 text-muted" />
            </div>
            <p
              className={`font-display mt-2 text-2xl font-bold tabular ${
                accent === "accent"
                  ? "text-accent"
                  : accent === "destructive"
                  ? "text-destructive"
                  : ""
              }`}
            >
              {value}
            </p>
            <p className="text-muted mt-1 text-xs">{hint}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-surface">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold">Assigned courses</h2>
          <Link href="/lecturers/courses" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </header>
        <ul className="divide-y divide-border">
          {mockLecturer.courses.map((c) => {
            const pending = c.students.filter((s) => s.score === null).length;
            return (
              <li key={c.code}>
                <Link
                  href={`/lecturers/courses/${encodeURIComponent(c.code)}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-background/40"
                >
                  <div>
                    <p className="font-mono text-xs text-muted">{c.code}</p>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-muted text-xs">{c.level} · {c.units} units</p>
                  </div>
                  <div className="text-right">
                    {pending > 0 ? (
                      <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                        {pending} pending
                      </span>
                    ) : (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Complete
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}