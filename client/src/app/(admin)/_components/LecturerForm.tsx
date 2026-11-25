"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { RegNoField } from "./RegNoField";
import type { AdminLecturerRow } from "@/lib/mockAdmin";

export function LecturerForm({ onCreated }: { onCreated?: (l: AdminLecturerRow) => void }) {
  const router = useRouter();
  const [staffNo, setStaffNo] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [rank, setRank] = useState("Lecturer II");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!/^\d{4}\/\d{4}\/NUT\/\d{2,4}$/i.test(staffNo.trim()))
      e.staffNo = "Invalid staff number format.";
    if (name.trim().length < 3) e.name = "Name is required.";
    if (!department.trim()) e.department = "Department is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Enter a valid email.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const row: AdminLecturerRow = {
      staffNo: staffNo.trim(),
      name: name.trim(),
      department: department.trim(),
      rank,
      email: email.trim(),
      courses: 0,
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    onCreated?.(row);
    setSubmitted(true);
    setTimeout(() => router.push("/admin/lecturers"), 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="font-display text-sm font-semibold">Lecturer details</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <RegNoField
            value={staffNo}
            onChange={setStaffNo}
            kind="lecturer"
            error={errors.staffNo}
          />

          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              placeholder="Dr. Ada Nwosu"
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
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
            <label className="block text-sm font-medium">Rank</label>
            <select
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            >
              <option>Lecturer II</option>
              <option>Lecturer I</option>
              <option>Senior Lecturer</option>
              <option>Associate Professor</option>
              <option>Professor</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              placeholder="staff@example.edu.ng"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
        </div>
      </div>

      {submitted ? (
        <p className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
          <Check className="h-4 w-4" /> Lecturer registered. Redirecting…
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
            Register lecturer
          </button>
        </div>
      )}
    </form>
  );
}