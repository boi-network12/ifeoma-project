"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { mockLecturer } from "@/lib/mockLecturer";
import { ScoreForm } from "../../../_components/ScoreForm";

export default function CourseScorePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const decoded = decodeURIComponent(code);

  const course = useMemo(
    () => mockLecturer.courses.find((c) => c.code === decoded),
    [decoded]
  );

  if (!course) {
    return (
      <div className="space-y-4">
        <Link href="/lecturers/courses" className="flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to courses
        </Link>
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="font-display text-lg font-semibold">Course not found</p>
          <p className="text-muted mt-1 text-sm">
            No course with code <span className="font-mono">{decoded}</span> is assigned to you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/lecturers/courses"
        className="flex w-fit items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      <div>
        <p className="font-mono text-xs text-muted">{course.code}</p>
        <h1 className="font-display text-2xl font-bold">{course.title}</h1>
        <p className="text-muted mt-1 flex items-center gap-2 text-sm">
          <Users className="h-3.5 w-3.5" />
          {course.students.length} students · {course.level} · {course.units} units ·{" "}
          {course.session} {course.semester}
        </p>
      </div>

      <ScoreForm
        initialStudents={course.students}
        onSubmit={(updated) => {
          // When backend is live: PATCH /api/courses/{code}/scores
          console.log("Saved scores for", course.code, updated);
        }}
      />
    </div>
  );
}