"use client";

import Link from "next/link";
import { BookOpen, Users, ChevronRight } from "lucide-react";
import { mockLecturer } from "@/lib/mockLecturer";

export default function LecturerCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">My Courses</h1>
        <p className="text-muted text-sm">
          {mockLecturer.courses.length} courses assigned · {mockLecturer.courses?.[0]?.session ?? ""}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {mockLecturer.courses.map((c) => {
          const entered = c.students.filter((s) => s.score !== null).length;
          const pct = c.students.length
            ? Math.round((entered / c.students.length) * 100)
            : 0;
          return (
            <Link
              key={c.code}
              href={`/lecturers/courses/${encodeURIComponent(c.code)}`}
              className="group rounded-xl border border-border bg-surface p-4 transition hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted" />
                  <p className="font-mono text-xs text-muted">{c.code}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5" />
              </div>
              <p className="font-display mt-2 font-semibold">{c.title}</p>
              <p className="text-muted text-xs">
                {c.level} · {c.units} units · {c.session} {c.semester}
              </p>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted">
                  <Users className="h-3 w-3" /> {c.students.length} students
                </span>
                <span className={pct === 100 ? "text-accent" : "text-warning"}>
                  {pct}% entered
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={`h-full rounded-full ${pct === 100 ? "bg-accent" : "bg-warning"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}