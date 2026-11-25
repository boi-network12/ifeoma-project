# Acadex — Student Result Processing & Management System

> A web-based platform for managing academic records, processing results, and generating reports for educational institutions.
>
> **Status:** Frontend complete (mock data). Backend integration pending.


## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Roles & Permissions](#4-roles--permissions)
5. [Authentication Flow](#5-authentication-flow)
6. [Data Models (Mock)](#6-data-models-mock)
7. [Pages & Routes](#7-pages--routes)
8. [Design System](#8-design-system)
9. [Component Architecture](#9-component-architecture)
10. [Known Limitations (Current Mock State)](#10-known-limitations-current-mock-state)
11. [Backend Integration Plan (Future)](#11-backend-integration-plan-future)
12. [Testing Checklist](#12-testing-checklist)
13. [Design Decisions & Rationale](#13-design-decisions--rationale)
14. [Setup & Running](#14-setup--running)
15. [Roadmap](#15-roadmap)

---

## 1. Project Overview

**Acadex** is a role-based academic management system built with Next.js App Router. It serves three user groups:

| Role | What they do |
|------|-------------|
| **Student** | View results, registered courses, and profile |
| **Lecturer** | Enter and manage scores for assigned courses |
| **Admin** | Register users (students + lecturers), manage accounts, monitor system |

### Core Problem It Solves

Manual result processing is error-prone, slow, and hard to audit. Acadex provides:

- **Centralized records** — one source of truth for all student/lecturer data
- **Role-based access** — students can't edit marks; only lecturers can enter scores
- **Automatic grade computation** — scores → grades → GPA computed consistently
- **Fast lookup** — students find their results instantly by registration number
- **Audit trail** (planned) — every change is logged when backend is connected

---

## 2. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15+ (App Router) | Server components, route groups, file-based routing |
| **Language** | TypeScript | Type safety across roles, forms, and API contracts |
| **Styling** | Tailwind CSS v4 | Utility-first, design tokens via `@theme` |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **State** | React Context + `useState` | Auth state, drawer state, form state |
| **Auth (mock)** | `localStorage` + regex inference | Stand-in for backend session |
| **Fonts** | Inter, Plus Jakarta Sans, JetBrains Mono | Body, display, mono (see Design System) |

### Backend (Planned)

| Layer | Planned Technology |
|-------|-------------------|
| API | Next.js Route Handlers (`/api/*`) |
| Database | PostgreSQL (or MySQL) |
| ORM | Prisma |
| Auth | JWT or NextAuth (session cookies) |
| Password | bcrypt |
| Validation | Zod (shared between client & server) |

---

## 3. Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, metadata, UserProvider)
│   ├── page.tsx                      # Root redirector (/ → login or dashboard)
│   ├── globals.css                   # Design tokens + Tailwind config
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # /login
│   │
│   ├── (students)/
│   │   ├── _components/              # Route-private (never becomes a URL)
│   │   │   ├── StudentsShell.tsx     # Client shell: sidebar + topbar + drawer
│   │   │   ├── StudentSidebar.tsx
│   │   │   ├── StudentTopbar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   └── ResultTable.tsx
│   │   ├── layout.tsx                # Server component, `instant = false`
│   │   └── students/
│   │       ├── page.tsx              # /students (dashboard)
│   │       ├── results/page.tsx      # /students/results
│   │       ├── courses/page.tsx      # /students/courses
│   │       └── profile/page.tsx      # /students/profile
│   │
│   ├── (lecturers)/
│   │   ├── _components/
│   │   │   ├── LecturerShell.tsx
│   │   │   ├── LecturerSidebar.tsx
│   │   │   ├── LecturerTopbar.tsx
│   │   │   └── ScoreForm.tsx
│   │   ├── layout.tsx
│   │   └── lecturers/
│   │       ├── page.tsx              # /lecturers
│   │       ├── courses/
│   │       │   ├── page.tsx          # /lecturers/courses
│   │       │   └── [code]/page.tsx   # /lecturers/courses/COM-211
│   │       └── profile/page.tsx
│   │
│   └── (admin)/
│       ├── _components/
│       │   ├── AdminShell.tsx
│       │   ├── AdminSidebar.tsx
│       │   ├── AdminTopbar.tsx
│       │   ├── UsersTable.tsx
│       │   ├── StatusPill.tsx
│       │   ├── RegNoField.tsx
│       │   ├── StudentForm.tsx
│       │   └── LecturerForm.tsx
│       ├── layout.tsx
│       └── admin/
│           ├── page.tsx              # /admin
│           ├── students/
│           │   ├── page.tsx          # /admin/students
│           │   └── new/page.tsx      # /admin/students/new
│           ├── lecturers/
│           │   ├── page.tsx
│           │   └── new/page.tsx
│           └── profile/page.tsx
│
├── components/                       # SHARED across all roles
│   └── ProtectedRoute.tsx            # Role guard
│
├── context/
│   └── UserContext.tsx               # Auth state (user, login, logout, ROLE_HOME)
│
└── lib/
    ├── mockStudent.ts
    ├── mockLecturer.ts
    └── mockAdmin.ts
```

### Key Convention: `_components` vs `components`

| Location | Scope | Example |
|----------|-------|---------|
| `src/components/` | Shared across roles | `ProtectedRoute` |
| `src/app/(role)/_components/` | Role-private only | `ScoreForm` (lecturer-only) |

Folders starting with `_` are **excluded from routing** by Next.js — `_components` will never accidentally become a URL.

---

## 4. Roles & Permissions

| Capability | Student | Lecturer | Admin |
|-----------|:-------:|:--------:|:-----:|
| View own results | ✅ | — | ✅ |
| Enter/edit scores | ❌ | ✅ (own courses only) | ❌ |
| Register users | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| View any student's result | ❌ | ❌ | ✅ |
| Manage courses | ❌ | ❌ | ✅ |
| Suspend accounts | ❌ | ❌ | ✅ |

### Registration Number Formats

Role is **inferred from the number format** — users don't choose their role.

| Role | Format | Example |
|------|--------|---------|
| Student (ND) | `YYYY/YYYY/ND/DEPT/NNNN` | `2023/2024/ND/CS/1042` |
| Student (MTI) | `YYYY/YYYY/MTI/DEPT/NNNN` | `2023/2024/MTI/SF/2011` |
| Lecturer | `YYYY/YYYY/NUT/NNN` | `1999/2000/NUT/204` |
| Admin | `YYYY/YYYY/ADMIN/NNN` | `2023/2024/ADMIN/101` |

Regex patterns live in one place (`inferRole` on login, `RegNoField` on registration) — when formats change, update both.

---

## 5. Authentication Flow

### Current (Mock)

```
User visits /students (or any protected route)
    │
    ▼
ProtectedRoute checks useUser()
    │
    ├── isLoading → show loading, wait
    ├── !user → redirect /login
    ├── wrong role → redirect ROLE_HOME[user.role]
    └── correct role → render children
```

### Login Flow

```
/login
    │
    ▼
User enters regNo + password
    │
    ▼
inferRole(regNo) → "student" | "lecturer" | "admin" | null
    │
    ├── null → inline error
    └── role → login({ id, name, role })
              │
              ▼
         localStorage.setItem("acadex_user", ...)
              │
              ▼
         router.push(ROLE_HOME[role])
```

### Key Files

- `context/UserContext.tsx` — holds `user`, `isLoading`, `login()`, `logout()`, exports `ROLE_HOME`
- `components/ProtectedRoute.tsx` — role guard, redirects on mismatch
- `app/(auth)/login/page.tsx` — form + role inference

### Planned (Backend)

Replace two things inside `UserContext` and `LoginPage`:

```tsx
// UserContext.tsx — current mock
useEffect(() => {
  const raw = localStorage.getItem("acadex_user");
  if (raw) setUser(JSON.parse(raw));
  setIsLoading(false);
}, []);

// UserContext.tsx — with backend
useEffect(() => {
  fetch("/api/me")
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => setUser(data?.user ?? null))
    .finally(() => setIsLoading(false));
}, []);
```

```tsx
// LoginPage — current mock
setTimeout(() => {
  login({ id: trimmed, name: MOCK_NAMES[role], role });
  router.push(ROLE_HOME[role]);
}, 400);

// LoginPage — with backend
const res = await fetch("/api/login", {
  method: "POST",
  body: JSON.stringify({ regNo: trimmed, password }),
});
if (!res.ok) {
  setError({ field: "form", message: "Invalid credentials" });
  return;
}
const { user } = await res.json();
login(user);
router.push(ROLE_HOME[user.role]);
```

**Nothing else in the app changes** — every component reads from `useUser()`, so the rest of the tree is backend-agnostic.

---

## 6. Data Models (Mock)

### Student (`lib/mockStudent.ts`)

```typescript
interface CourseResult {
  code: string;
  title: string;
  units: number;
  score: number;       // 0–100
  grade: string;       // A, B, C, D, E, F
  remark: "Pass" | "Fail";
}

interface SemesterResult {
  session: string;     // "2024/2025"
  semester: "First" | "Second";
  level: string;       // "ND II"
  courses: CourseResult[];
}
```

### Lecturer (`lib/mockLecturer.ts`)

```typescript
interface EnrolledStudent {
  regNo: string;
  name: string;
  level: string;
  score: number | null;  // null = not yet entered
}

interface LecturerCourse {
  code: string;          // "COM 211"
  title: string;
  units: number;
  level: string;
  semester: "First" | "Second";
  session: string;
  students: EnrolledStudent[];
}
```

### Admin (`lib/mockAdmin.ts`)

```typescript
interface AdminStudentRow {
  regNo: string;
  name: string;
  program: "ND" | "MTI";
  department: string;
  level: string;
  email: string;
  status: "active" | "suspended";
  createdAt: string;     // ISO date
}

interface AdminLecturerRow {
  staffNo: string;
  name: string;
  department: string;
  rank: string;
  email: string;
  courses: number;
  status: "active" | "suspended";
  createdAt: string;
}
```

### Planned Database Schema

```sql
CREATE TABLE users (
  user_id       SERIAL PRIMARY KEY,
  identifier    VARCHAR(30) UNIQUE NOT NULL,  -- regNo / staffNo / adminNo
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(10) NOT NULL CHECK (role IN ('student','lecturer','admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE students (
  student_id  SERIAL PRIMARY KEY,
  user_id     INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  reg_no      VARCHAR(30) UNIQUE NOT NULL,
  full_name   VARCHAR(100) NOT NULL,
  program     VARCHAR(10) NOT NULL,
  department  VARCHAR(50) NOT NULL,
  level       VARCHAR(10) NOT NULL,
  email       VARCHAR(100),
  status      VARCHAR(10) DEFAULT 'active'
);

CREATE TABLE lecturers (
  lecturer_id SERIAL PRIMARY KEY,
  user_id     INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  staff_no    VARCHAR(30) UNIQUE NOT NULL,
  full_name   VARCHAR(100) NOT NULL,
  department  VARCHAR(50) NOT NULL,
  rank        VARCHAR(50),
  email       VARCHAR(100),
  status      VARCHAR(10) DEFAULT 'active'
);

CREATE TABLE courses (
  course_id     SERIAL PRIMARY KEY,
  code          VARCHAR(20) UNIQUE NOT NULL,
  title         VARCHAR(100) NOT NULL,
  units         INT NOT NULL,
  level         VARCHAR(10),
  lecturer_id   INT REFERENCES lecturers(lecturer_id),
  session       VARCHAR(9),
  semester      VARCHAR(10)
);

CREATE TABLE enrollments (
  enrollment_id SERIAL PRIMARY KEY,
  student_id    INT REFERENCES students(student_id),
  course_id     INT REFERENCES courses(course_id),
  UNIQUE (student_id, course_id)
);

CREATE TABLE results (
  result_id      SERIAL PRIMARY KEY,
  enrollment_id  INT UNIQUE REFERENCES enrollments(enrollment_id),
  score          NUMERIC(5,2),
  grade          VARCHAR(2),
  entered_by     INT REFERENCES lecturers(lecturer_id),
  entered_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ
);
```

---

## 7. Pages & Routes

### Public

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Redirects based on auth state |
| `/login` | `app/(auth)/login/page.tsx` | Login form |

### Student (`(students)`)

| Route | Purpose |
|-------|---------|
| `/students` | Dashboard (CGPA, stats, latest results) |
| `/students/results` | Full results — collapsible semesters with GPA |
| `/students/courses` | Registered courses list |
| `/students/profile` | Academic info + contact (editable mock) |

### Lecturer (`(lecturers)`)

| Route | Purpose |
|-------|---------|
| `/lecturers` | Dashboard (pending scores, assigned courses) |
| `/lecturers/courses` | Course grid with completion progress |
| `/lecturers/courses/[code]` | **Score entry form** — the core lecturer page |
| `/lecturers/profile` | Staff info |

### Admin (`(admin)`)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard (counts, quick actions, recent users) |
| `/admin/students` | Student list with search |
| `/admin/students/new` | Register student form |
| `/admin/lecturers` | Lecturer list with search |
| `/admin/lecturers/new` | Register lecturer form |
| `/admin/profile` | Admin account info |

---

## 8. Design System

### Color Palette

Academic blue + emerald accent. All tokens defined in `globals.css` and exposed via `@theme`.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | `#f8fafc` | `#0b1120` | Page bg |
| `surface` | `#ffffff` | `#111827` | Cards, tables |
| `foreground` | `#0f172a` | `#e2e8f0` | Body text |
| `muted` | `#64748b` | `#94a3b8` | Secondary text |
| `border` | `#e2e8f0` | `#1e293b` | Dividers |
| `primary` | `#1d4ed8` | `#3b82f6` | Buttons, links |
| `accent` | `#059669` | `#10b981` | Success, pass |
| `warning` | `#d97706` | `#f59e0b` | Pending |
| `destructive` | `#dc2626` | `#ef4444` | Errors, fail |

Tailwind usage: `bg-surface`, `text-muted`, `border-border`, `text-primary`, etc.

### Typography

| Purpose | Font | Variable | Weight |
|---------|------|----------|--------|
| Body | Inter | `--font-inter` | 400–500 |
| Display / headings | Plus Jakarta Sans | `--font-jakarta` | 500–800 |
| Numbers / codes | JetBrains Mono | `--font-jetbrains` | 400 |

Use `font-display` for headings, `font-mono` for reg numbers/codes, and `tabular` class for aligned numbers in tables.

### Spacing & Layout

- Container: `max-w-md` for forms, full-width for dashboards
- Cards: `rounded-xl border border-border bg-surface p-4`
- Shell: sidebar `w-56` + topbar + content padding `p-4 sm:p-6`
- Mobile: sidebar hidden below `md`, replaced by drawer + hamburger

---

## 9. Component Architecture

### Shell Pattern (used by all three roles)

Each role follows the same three-file structure:

```
(role)/layout.tsx              → server component, exports `instant = false`
(role)/_components/
    RoleShell.tsx              → "use client", holds drawer state
    RoleSidebar.tsx            → desktop sidebar + mobile drawer export
    RoleTopbar.tsx             → hamburger + user info
```

**Why the split?**

- `layout.tsx` must be a **server component** so it can export `instant = false` (a route segment config that's illegal in client components — this causes a build error if you try)
- The shell needs `useState` for the drawer → must be a client component
- Splitting them lets both requirements coexist

### Guard Pattern

```tsx
// (role)/layout.tsx
export const instant = false;

export default function RoleLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={["role"]}>
      <RoleShell>{children}</RoleShell>
    </ProtectedRoute>
  );
}
```

`ProtectedRoute` renders `{children}` **only when authenticated + role matches**, otherwise redirects. This is why `instant = false` is needed — without it, Next.js 16.3's instant-navigation validator sees the segment "dropped" during prerender and warns loudly.

### Form Pattern

All forms share:

1. **Per-field state** via `useState`
2. **Validate on submit** (not on keystroke) — `validate()` returns `Record<string, string>`
3. **Inline errors** below each field with `aria-invalid` + `aria-describedby`
4. **Mock persistence** — `onCreated` callback, success toast, redirect after delay
5. **No backend** — the form is shape-correct but doesn't `POST` anywhere

`ScoreForm` adds: **dirty-state tracking** (Save disabled when unchanged), **per-row validation** (0–100 or empty), and **derived grade display** from score.

---

## 10. Known Limitations (Current Mock State)

These are deliberate — they'll resolve when the backend is connected.

| Limitation | Impact | Fix |
|-----------|--------|-----|
| Auth stored in `localStorage` | Refresh works, but changing browser loses session | Real JWT cookie session |
| Password not validated | Any password works | `bcrypt.compare` on server |
| Role inferred from regex | Can be spoofed by typing an admin number | Server looks up user, returns role |
| Data from `mock*.ts` | Changes don't persist across refresh | Database + API |
| Form "Save" only updates local state | Nothing is actually saved | `POST /api/*` endpoints |
| No real file upload | No profile pictures or transcripts | `multer` / S3 |
| No email notifications | Users must check manually | `nodemailer` / SendGrid |
| Print uses browser `window.print()` | Format depends on browser | Server-side PDF generation |
| No audit log | Can't see "who changed what" | `audit_log` table |
| No pagination | Tables show all rows | `?page=N&limit=20` + server pagination |
| Mock data uses one student | No multi-student testing | Seed script for DB |

**These limitations are features of the demo.** The UI, routing, guards, and validation are all production-shaped — only the data layer is stubbed. That means the backend work is **additive**, not a rewrite.

---

## 11. Backend Integration Plan (Future)

When the backend is ready, here's the order to connect things:

### Phase 1 — Auth (unblocks everything)

1. Install Prisma + Zod + bcrypt + JWT
2. Create `users` table, seed one admin
3. Build `/api/login` → returns `{ user, token }` or `{ error }`
4. Build `/api/me` → returns current user from session
5. Build `/api/logout` → clears session
6. Update `UserContext`:
   - `useEffect` calls `/api/me` instead of `localStorage`
   - `login()` posts to `/api/login`
   - `logout()` posts to `/api/logout`
7. **Delete** `inferRole` and `MOCK_NAMES` from `LoginPage` — server returns role

### Phase 2 — Users (admin CRUD)

1. Build `/api/students` (GET list, POST create)
2. Build `/api/lecturers` (GET list, POST create)
3. Wire `StudentForm` / `LecturerForm` to POST
4. Wire `UsersTable` to fetch from GET
5. Add `/api/students/[id]` for edit/delete

### Phase 3 — Courses & Enrollment

1. Build `/api/courses` (admin manages, lecturer sees own)
2. Build `/api/courses/[code]/students` (lecturer fetches enrolled)
3. Add enrollment flow (admin or CSV import)

### Phase 4 — Results

1. Build `/api/results/[courseCode]` (POST from `ScoreForm`)
2. Build `/api/results/me` (student fetches own)
3. Add grade computation on server (don't trust client)
4. Add moderation workflow (submit → approve → publish)

### Phase 5 — Reports & Polish

1. Server-side PDF generation (`@react-pdf/renderer` or `puppeteer`)
2. CSV export for admin
3. Email notifications on result publication
4. Audit log table + admin view
5. Pagination + filtering on all lists

### What Doesn't Change

- Every page in `app/(role)/*/page.tsx` — data comes via `mock*` imports, which become `fetch` calls or server component queries
- Every `_components/` file — they accept props, not data sources
- Every `layout.tsx` — the shell and guards stay identical
- Every form — swap the mock `onCreated` for a real `POST`, rest stays

**Rule of thumb:** components should never know *where* data comes from. They accept props and emit events. That's why the backend swap is surgical.

---

## 12. Testing Checklist

### Auth

- [ ] `/` with no user → redirects to `/login`
- [ ] `/` with student user → redirects to `/students`
- [ ] `/students` while logged out → redirects to `/login`
- [ ] `/students` while logged in as lecturer → redirects to `/lecturers`
- [ ] `/admin` while logged in as student → redirects to `/students`
- [ ] Logout → clears `localStorage`, lands on `/login`
- [ ] Refresh on `/students` → stays logged in

### Login

- [ ] `2023/2024/ND/CS/1042` + any password → `/students`
- [ ] `2023/2024/MTI/SF/2011` + any password → `/students`
- [ ] `1999/2000/NUT/204` + any password → `/lecturers`
- [ ] `2023/2024/ADMIN/101` + any password → `/admin`
- [ ] `random-text` → inline error on regNo
- [ ] Empty password → inline error on password
- [ ] Show/Hide toggle works

### Student

- [ ] Dashboard shows CGPA, course count, units, failed count
- [ ] Results page: collapse/expand semesters, per-semester GPA matches manual calc
- [ ] Courses page lists all courses with units
- [ ] Profile: Edit → change → Save → notice appears; refresh reverts

### Lecturer

- [ ] Dashboard shows pending count per course
- [ ] Click course → `/lecturers/courses/[code]` loads correct students
- [ ] Enter score `85` → grade shows A; `72` → B; `49` → F
- [ ] Enter score `105` → inline error
- [ ] Enter `-1` → inline error
- [ ] Clear a score → grade shows `—`, Save becomes dirty
- [ ] Save → toast appears, dirty state clears
- [ ] Navigate back → unsaved changes are lost (expected in mock)

### Admin

- [ ] Dashboard counts match mock data
- [ ] Students list: search filters correctly
- [ ] Lecturers list: search filters correctly
- [ ] Register student with valid data → success + redirect
- [ ] Register student with invalid regNo → inline error
- [ ] Register lecturer with valid staffNo → success + redirect
- [ ] Register lecturer with student regNo → inline error (wrong pattern)
- [ ] RegNoField shows live preview when valid

### Responsive

- [ ] All pages work at 375px (iPhone SE)
- [ ] Sidebar hidden below `md`, hamburger appears
- [ ] Drawer opens/closes, backdrop tap closes
- [ ] Drawer link closes drawer on navigation
- [ ] Tables scroll horizontally on small screens

### Theme

- [ ] Dark mode respects `prefers-color-scheme`
- [ ] All text passes contrast (muted text still readable)
- [ ] Focus rings visible on keyboard nav

---

## 13. Design Decisions & Rationale

### Why route groups (`(students)`, `(lecturers)`, `(admin)`)?

Route groups let us:
1. Share a shell layout across a role's pages without adding a URL segment
2. Keep role-private components in `_components` beside their routes
3. Enforce role guards at the layout level (one guard, all pages protected)

Without route groups, we'd have `/students/dashboard`, `/students/results`, etc. and duplicate guards on every page.

### Why `_components` instead of `components`?

Next.js excludes folders starting with `_` from routing. So `_components` never becomes a URL, and we get a clear boundary:

- `components/` = shared across roles
- `app/(role)/_components/` = private to that role

Deleting a role later is `rm -rf (role)/` — no orphaned files in the shared folder.

### Why `instant = false` in layout?

Next.js 16.3 validates that segments support instant navigation. When a layout wraps children in a client guard (`ProtectedRoute`) that can return `null` during loading, Next.js sees `{children}` "dropped from rendering" and warns.

`instant = false` opts out of that validation for the segment. It's legal **only in server components**, which is why we split `layout.tsx` (server) from `XShell.tsx` (client).

### Why infer role from reg number?

In a real system, the server knows the role. But in mock mode, we don't want three buttons ("Login as student / lecturer / admin") — that's not how the real product works, and it makes it harder to swap for real auth later.

By inferring from the number format, the mock login behaves exactly like the real one from the user's perspective. And the inference logic is in **one function** (`inferRole`) that gets deleted when the backend is ready.

### Why the `ROLE_HOME` map?

```tsx
const ROLE_HOME: Record<Role, string> = {
  student: "/students",
  lecturer: "/lecturers",
  admin: "/admin",
};
```

Instead of:
```tsx
role === "lecturer" ? "/lecturers" : role === "admin" ? "/admin" : "/students"
```

Adding a 4th role (e.g., "bursar") is one line, not another nested ternary. The map lives in `UserContext.tsx` and is imported by both `LoginPage` and `ProtectedRoute` — single source of truth.

### Why Tailwind with semantic tokens?

```tsx
// ❌ Fragile — Tailwind JIT can't see `text-${align}` at build time
className={`text-${align}`}

// ✅ Safe — literal strings exist in source
const alignClass = { left: "text-left", center: "text-center", right: "text-right" };
className={alignClass[align]}
```

Dynamic class construction breaks Tailwind's static extraction. If the class isn't used literally elsewhere, it's not emitted, and styling silently fails. Everywhere we need dynamic classes, we use a lookup map, not template strings.

### Why mock data in `lib/`?

- Keeps pages clean (no inline 50-line objects)
- Makes the shape explicit (TypeScript interfaces)
- Single place to change when backend arrives (`mockStudent` → `getStudent()`)
- Easy to seed a database from the mock files later

### Why three fonts?

- **Inter** — every pixel of body text. Small file, extremely legible.
- **Plus Jakarta Sans** — headings and the brand. Geometric, professional. Distinguishes Acadex from a template.
- **JetBrains Mono** — reg numbers, course codes, scores. Monospaced so tables align without `tabular-nums` gymnastics.

Three fonts is the maximum I'd use. More than three feels unfocused.

---

## 14. Setup & Running

### Prerequisites

- Node.js 20+
- npm or pnpm

### Install

```bash
git clone <repo-url>
cd acadex
npm install
```

### Add dependency (icons)

```bash
npm install lucide-react
```

### Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Try the three roles

| Role | Number | Password |
|------|--------|----------|
| Student | `2023/2024/ND/CS/1042` | any |
| Lecturer | `1999/2000/NUT/204` | any |
| Admin | `2023/2024/ADMIN/101` | any |

### Reset state

If you're stuck in a weird auth state, open DevTools → Application → Local Storage → delete `acadex_user` → refresh.

### Build

```bash
npm run build
npm start
```

If you hit the "`instant` field" build error on a page, check that:
- `instant = false` is **only** in `layout.tsx` files (server components)
- No page or client component exports `instant`

---

## 15. Roadmap

### Done

- [x] Project scaffold with Next.js App Router
- [x] Design system (fonts, palette, tokens)
- [x] Auth context + role guard
- [x] Login page with role inference
- [x] Student section (dashboard, results, courses, profile)
- [x] Lecturer section (dashboard, courses, score entry, profile)
- [x] Admin section (dashboard, user lists, registration forms, profile)
- [x] Mobile drawer navigation for all roles
- [x] Mock data for all three roles

### Next (Backend)

- [ ] Database schema (Prisma)
- [ ] `/api/login`, `/api/me`, `/api/logout`
- [ ] `/api/students`, `/api/lecturers`
- [ ] `/api/courses`, `/api/enrollments`
- [ ] `/api/results`
- [ ] Replace mock data with fetch calls
- [ ] Seed script

### Future

- [ ] Server-side PDF generation for result slips
- [ ] CSV bulk import (students, enrollment)
- [ ] Email notifications
- [ ] Audit log
- [ ] Password reset flow
- [ ] Bulk approve results (moderation workflow)
- [ ] Analytics dashboard (admin: pass rates, GPA distribution)
- [ ] Export to Excel
- [ ] SMS notifications (African market — parents want SMS)
- [ ] Multi-tenancy (multiple schools on one deployment)

---

## Appendix A — Common Pitfalls

### "This page could not be found" at `/`

You forgot `app/page.tsx`. Route groups don't create URLs — they only group routes. `/` needs its own page.

### "`instant` field" build error

You exported `instant` from a client component. Move it to a server `layout.tsx`.

### "Module has no exported member `StatusPill`"

`StatusPill` needs to be either exported from `UsersTable.tsx` or in its own file. Pick one and import accordingly.

### Dynamic Tailwind classes don't work

`className={`text-${align}`}` doesn't generate CSS. Use a lookup map:
```tsx
const alignClass = { left: "text-left", center: "text-center", right: "text-right" };
```

### Login works but dashboard 404s

You logged in successfully, but `router.push("/students")` hit a missing page. Check that `(students)/students/page.tsx` exists — the URL segment comes from the **inner** folder name, not the route group name.

---

## Appendix B — Regex Reference

```
Students (ND):      /^\d{4}\/\d{4}\/ND\/[A-Z]{2,4}\/\d{3,5}$/i
Students (MTI):     /^\d{4}\/\d{4}\/MTI\/[A-Z]{2,4}\/\d{3,5}$/i
Students (both):    /^\d{4}\/\d{4}\/(ND|MTI)\/[A-Z]{2,4}\/\d{3,5}$/i
Lecturers:          /^\d{4}\/\d{4}\/NUT\/\d{2,4}$/i
Admins:             /^\d{4}\/\d{4}\/ADMIN\/\d{2,4}$/i
Email:              /^[^@\s]+@[^@\s]+\.[^@\s]+$/
```

All case-insensitive (`i` flag). If you add `HND` or `BSc` later, extend the alternation: `(ND|MTI|HND)`.

---

## Appendix C — Grade Scale

| Score Range | Grade | Grade Point | Remark |
|-------------|-------|-------------|--------|
| 70–100 | A | 5 | Pass |
| 60–69 | B | 4 | Pass |
| 50–59 | C | 3 | Pass |
| 45–49 | D | 2 | Pass |
| 40–44 | E | 1 | Pass |
| 0–39 | F | 0 | Fail |

**GPA formula:** `Σ(grade_point × units) / Σ(units)`

Used in `students/results/page.tsx` (`semesterGPA` function) and `lecturers/_components/ScoreForm.tsx` (`gradeFromScore`).

---

## Appendix D — Stack for the Backend

If you're the one wiring up the backend, here's a minimal stack that pairs well with this frontend:

```bash
npm install prisma @prisma/client zod bcryptjs jsonwebtoken
npm install -D @types/bcryptjs @types/jsonwebtoken
```

| Package | Purpose |
|---------|---------|
| `prisma` | Schema + migrations + type-safe queries |
| `zod` | Request body validation (share schemas with client) |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | Session tokens (or use `next-auth`) |

### Minimal `/api/login` (reference)

```ts
// app/api/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  regNo: z.string(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { regNo, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { identifier: regNo } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set cookie (JWT or session) then return user
  return NextResponse.json({
    user: { id: user.identifier, name: user.name ?? "User", role: user.role },
  });
}
```

This is a sketch — production needs CSRF protection, rate limiting, and proper session management. But it's the right shape, and the frontend is already built to consume it.

---

*Last updated: frontend complete, backend pending. Questions → contact the author.*