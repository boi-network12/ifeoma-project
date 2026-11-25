"use client";

import { mockStudent } from "@/lib/mockStudent";

export default function CoursesPage() {
  const latest = mockStudent.results[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Registered Courses</h1>
        <p className="text-muted text-sm">
          {latest.session} — {latest.semester} Semester · {latest.level}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {latest.courses.map((c) => (
          <div key={c.code} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-muted">{c.code}</p>
                <p className="font-medium">{c.title}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {c.units} units
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}