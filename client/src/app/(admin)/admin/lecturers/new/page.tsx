"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LecturerForm } from "../../../_components/LecturerForm";

export default function NewLecturerPage() {
  return (
    <div className="space-y-6">
      <Link href="/admin/lecturers" className="flex w-fit items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to lecturers
      </Link>
      <div>
        <h1 className="font-display text-2xl font-bold">Register lecturer</h1>
        <p className="text-muted text-sm">
          Staff numbers follow <span className="font-mono">YYYY/YYYY/NUT/NNN</span>.
        </p>
      </div>
      <LecturerForm />
    </div>
  );
}