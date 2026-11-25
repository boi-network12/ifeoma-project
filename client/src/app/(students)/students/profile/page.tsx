"use client";

import { useState } from "react";
import { Pencil, Check, Mail, Phone, MapPin, IdCard, GraduationCap } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { mockStudent } from "@/lib/mockStudent";

export default function ProfilePage() {
  const { user } = useUser();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [contact, setContact] = useState({
    email: "ifeoma.okafor@example.edu.ng",
    phone: "+234 801 234 5678",
    address: "12 Campus Road, Enugu",
  });

  const initials = (user?.name ?? "S")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <p className="text-muted text-sm">Your academic and contact information</p>
      </div>

      {/* Identity card */}
      <div className="flex flex-col items-start gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-display text-lg font-semibold">{user?.name ?? "—"}</p>
          <p className="text-muted text-sm">{mockStudent.program}</p>
          <p className="text-muted mt-1 flex items-center gap-1 text-xs font-mono">
            <IdCard className="h-3 w-3" /> {mockStudent.regNo}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-accent">
          <GraduationCap className="h-4 w-4" />
          <span className="text-sm font-semibold tabular">CGPA {mockStudent.cgpa.toFixed(2)}</span>
        </div>
      </div>

      {/* Academic info */}
      <section className="rounded-xl border border-border bg-surface">
        <header className="border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold">Academic</h2>
        </header>
        <dl className="divide-y divide-border">
          {[
            ["Department", mockStudent.department],
            ["Level", mockStudent.level],
            ["Current session", mockStudent.session],
            ["Semester", mockStudent.semester],
            ["Total units (current)", String(mockStudent.totalUnits)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3 text-sm">
              <dt className="text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Contact info */}
      <section className="rounded-xl border border-border bg-surface">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-semibold">Contact</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <Check className="h-3 w-3" /> Save
            </button>
          )}
        </header>

        <dl className="divide-y divide-border">
          {(
            [
              ["Email", "email", Mail],
              ["Phone", "phone", Phone],
              ["Address", "address", MapPin],
            ] as const
          ).map(([label, key, Icon]) => (
            <div key={key} className="flex items-center justify-between px-4 py-3 text-sm">
              <dt className="flex items-center gap-2 text-muted">
                <Icon className="h-3.5 w-3.5" /> {label}
              </dt>
              <dd className="flex-1 text-right">
                {editing ? (
                  <input
                    value={contact[key]}
                    onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
                    className="ml-auto w-full max-w-xs rounded-lg border border-border bg-background px-2 py-1 text-right text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                  />
                ) : (
                  <span className="font-medium">{contact[key]}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {saved && (
          <p className="border-t border-border px-4 py-2 text-xs text-accent">
            Contact details saved locally. Backend will sync when connected.
          </p>
        )}
      </section>
    </div>
  );
}