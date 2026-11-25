"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { RegNoField } from "./RegNoField";
import type { AdminStudentRow } from "@/lib/mockAdmin";

export function StudentForm({ onCreated }: { onCreated?: (s: AdminStudentRow) => void }) {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [program, setProgram] = useState<"ND" | "MTI">("ND");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^\d{4}\/\d{4}\/(ND|MTI)\/[A-Z]{2,4}\/\d{3,5}$/i.test(regNo.trim()))
      e.regNo = "Invalid registration number format.";
    if (name.trim().length < 3) e.name = "Name must be at least 3 characters.";
    if (!department.trim()) e.department = "Select or enter a department.";
    if (!level) e.level = "Choose a level.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const row: AdminStudentRow = {
      regNo: regNo.trim(),
      name: name.trim(),
      program,
      department: department.trim(),
      level,
      email: email.trim(),
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    // Mock persistence
    onCreated?.(row);
    setSubmitted(true);
    setTimeout(() => router.push("/admin/students"), 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-sm font-semibold">Student details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <RegNoField
            value={regNo}
            onChange={setRegNo}
            kind="student"
            error={errors.regNo}
          />

          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              placeholder="Ifeoma Okafor"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value as "ND" | "MTI")}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              <option value="ND">ND</option>
              <option value="MTI">MTI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Department</label>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              placeholder="Computer Science"
            />
            {errors.department && (
              <p className="mt-1 text-xs text-destructive">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              <option value="">Select…</option>
              <option value="ND I">ND I</option>
              <option value="ND II">ND II</option>
              <option value="MTI I">MTI I</option>
              <option value="MTI II">MTI II</option>
            </select>
            {errors.level && <p className="mt-1 text-xs text-destructive">{errors.level}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              placeholder="student@example.edu.ng"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>
      </div>

      {submitted ? (
        <p className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          <Check className="h-4 w-4" /> Student registered. Redirecting to list…
        </p>
      ) : (
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 text-xs text-muted">
            <AlertCircle className="h-3 w-3" /> Mock mode — data is not persisted yet.
          </p>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Register student
          </button>
        </div>
      )}
    </form>
  );
}