"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudentForm } from "../../../_components/StudentForm";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/students" className="flex w-fit items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to students
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold">Register student</h1>
        <p className="text-muted text-sm">
          The registration number follows <span className="font-mono">YYYY/YYYY/PROGRAM/DEPT/NNNN</span>.
        </p>
      </div>
      <StudentForm />
    </div>
  );
}