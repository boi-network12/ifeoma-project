"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { mockAdmin } from "@/lib/mockAdmin";
import { UsersTable, StatusPill, type Column } from "../../_components/UsersTable";
import type { AdminLecturerRow } from "@/lib/mockAdmin";

export default function AdminLecturersPage() {
  const columns: Column<AdminLecturerRow>[] = [
    {
      key: "staffNo",
      label: "Staff No",
      render: (r) => <span className="font-mono text-xs">{r.staffNo}</span>,
    },
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "rank", label: "Rank" },
    { key: "courses", label: "Courses", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (r) => <StatusPill status={r.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Lecturers</h1>
          <p className="text-muted text-sm">{mockAdmin.lecturers.length} staff registered</p>
        </div>
        <Link
          href="/admin/lecturers/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <UserPlus className="h-4 w-4" /> Register lecturer
        </Link>
      </div>

      <UsersTable
        rows={mockAdmin.lecturers}
        columns={columns}
        searchKeys={["staffNo", "name", "department", "email"]}
        searchPlaceholder="Search by name, staff no, department…"
        emptyText="No lecturers registered yet."
      />
    </div>
  );
}