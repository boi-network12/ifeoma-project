"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { mockStudent } from "@/lib/mockStudent";
import { StatCard } from "@/app/_components/StatCard";
import { ResultTable } from "@/app/_components/ResultTable";



export default function StudentsPage() {
  const { user } = useUser();
  const latest = mockStudent.results[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] ?? "Student"}
        </h1>
        <p className="text-muted text-sm">
          {mockStudent.program} · {mockStudent.level} · {mockStudent.session} {mockStudent.semester} Semester
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="CGPA" value={mockStudent.cgpa.toFixed(2)} accent="accent" hint="Cumulative" />
        <StatCard label="Courses" value={latest.courses.length} hint="This semester" />
        <StatCard label="Total Units" value={mockStudent.totalUnits} hint="Registered" />
        <StatCard
          label="Failed"
          value={latest.courses.filter((c) => c.remark === "Fail").length}
          accent="destructive"
          hint="This semester"
        />
      </div>

      <ResultTable result={latest} />

      <div className="flex gap-3">
        <Link
          href="/students/results"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          View all results
        </Link>
        <Link
          href="/students/courses"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
        >
          Registered courses
        </Link>
      </div>
    </div>
  );
}