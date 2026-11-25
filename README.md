
# Acadex — Student Result Processing & Management System

> A web-based platform for managing academic records, processing results, and generating reports.
>
> **Status:** Frontend complete (mock data). Backend (Express + TypeScript) pending.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure (Frontend)](#4-project-structure-frontend)
5. [Project Structure (Backend)](#5-project-structure-backend)
6. [Roles & Permissions](#6-roles--permissions)
7. [Authentication Flow](#7-authentication-flow)
8. [Data Models (Mock)](#8-data-models-mock)
9. [Pages & Routes](#9-pages--routes)
10. [Design System](#10-design-system)
11. [Component Architecture](#11-component-architecture)
12. [API Contract (Planned)](#12-api-contract-planned)
13. [Known Limitations (Mock State)](#13-known-limitations-mock-state)
14. [Backend Integration Plan](#14-backend-integration-plan)
15. [Testing Checklist](#15-testing-checklist)
16. [Design Decisions](#16-design-decisions)
17. [Setup & Running](#17-setup--running)
18. [Roadmap](#18-roadmap)

---

## 1. Project Overview

**Acadex** is a role-based academic management system. It serves three user groups:

| Role | What they do |
|------|-------------|
| **Student** | View results, registered courses, profile |
| **Lecturer** | Enter and manage scores for assigned courses |
| **Admin** | Register users, manage accounts, monitor system |

### Core Problem It Solves

Manual result processing is error-prone, slow, and hard to audit. Acadex provides:

- **Centralized records** — one source of truth for all student/lecturer data
- **Role-based access** — students can't edit marks; only lecturers can enter scores
- **Automatic grade computation** — scores → grades → GPA computed consistently
- **Fast lookup** — students find their results instantly by registration number
- **Audit trail** (planned) — every change is logged

---

## 2. Architecture

This is a **decoupled frontend/backend** — two separate processes, not one Next.js app.

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────┐
│  FRONTEND — Next.js 15 (port 3000)   │     │  BACKEND — Express + TS (port 4000)│
│                                       │     │                                  │
│  ┌─────────────────────────────────┐  │     │  ┌────────────────────────────┐  │
│  │ App Router pages                │  │     │  │ Routes                     │  │
│  │ (students) / (lecturers) /      │  │     │  │ /api/auth/login            │  │
│  │ (admin)                         │  │     │  │ /api/auth/me               │  │
│  │                                 │  │     │  │ /api/students              │  │
│  │ UserContext (holds session)     │  │     │  │ /api/lecturers             │  │
│  │ ProtectedRoute (role guard)     │  │     │  │ /api/courses               │  │
│  │                                 │  │     │  │ /api/results               │  │
│  └──────────────┬──────────────────┘  │     │  └────────────┬───────────────┘  │
│                 │                      │     │               │                  │
│                 │  fetch() with        │     │  ┌────────────▼───────────────┐  │
│                 │  credentials or      │─────┼─▶│ Controllers → Services →   │  │
│                 │  Bearer token        │     │  │ Repositories → Prisma      │  │
│                 │                      │     │  └────────────┬───────────────┘  │
│                 │                      │     │               │                  │
└─────────────────┼──────────────────────┘     └───────────────┼──────────────────┘
                  │                                            │
                  │             ┌──────────────────┐           │
                  └────────────▶│  PostgreSQL DB   │◀──────────┘
                                │  (Prisma ORM)    │
                                └──────────────────┘
```

### Why decoupled?

| Concern | Monolith (Next.js API) | Decoupled (Express) ✅ |
|---------|------------------------|------------------------|
| Deployment | One process | Two processes (or Docker compose) |
| Team skills | React-only | Frontend team / backend team can work independently |
| Testing | Harder — framework couples UI/API | Backend testable with Postman/Vitest without React |
| Swapping clients | Web-only | Same API serves mobile app, admin CLI, etc. |
| Scaling | Vertical | Backend can scale horizontally, frontend on CDN |

Since you're building with Express + TypeScript (a common academic/bootcamp pattern), the frontend must talk to a **separate origin**. That has two consequences:

1. **CORS must be configured** on Express to allow `http://localhost:3000`
2. **Auth uses tokens or cross-origin cookies** — the browser will not send cookies across origins unless `credentials: "include"` + proper CORS headers are set

---

## 3. Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| State | React Context + `useState` |
| Fonts | Inter, Plus Jakarta Sans, JetBrains Mono |

### Backend

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | **Express 4 + TypeScript** |
| ORM | Prisma |
| Database | MongoDB |
| Validation | Zod |
| Auth | JWT (jsonwebtoken) + bcrypt |
| CORS | `cors` middleware |
| Env | `dotenv` |
| Dev runner | `tsx watch` or `ts-node-dev` |
| Testing | Vitest + Supertest |

### Shared

| Layer | Technology |
|-------|-----------|
| Contracts | TypeScript types in a `shared/` package (optional) |
| API docs | OpenAPI/Swagger (optional) |

---

## 4. Project Structure (Frontend)

```
frontend/                             # Next.js app
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root: fonts, metadata, UserProvider
│   │   ├── page.tsx                  # / redirector
│   │   ├── globals.css               # Design tokens
│   │   │
│   │   ├── (auth)/
│   │   │   └── login/page.tsx        # /login
│   │   │
│   │   ├── (students)/
│   │   │   ├── _components/          # Route-private components
│   │   │   │   ├── StudentsShell.tsx
│   │   │   │   ├── StudentSidebar.tsx
│   │   │   │   ├── StudentTopbar.tsx
│   │   │   │   ├── StatCard.tsx
│   │   │   │   └── ResultTable.tsx
│   │   │   ├── layout.tsx            # Server, instant=false
│   │   │   └── students/
│   │   │       ├── page.tsx
│   │   │       ├── results/page.tsx
│   │   │       ├── courses/page.tsx
│   │   │       └── profile/page.tsx
│   │   │
│   │   ├── (lecturers)/
│   │   │   ├── _components/
│   │   │   ├── layout.tsx
│   │   │   └── lecturers/
│   │   │       ├── page.tsx
│   │   │       ├── courses/page.tsx
│   │   │       ├── courses/[code]/page.tsx
│   │   │       └── profile/page.tsx
│   │   │
│   │   └── (admin)/
│   │       ├── _components/
│   │       ├── layout.tsx
│   │       └── admin/
│   │           ├── page.tsx
│   │           ├── students/page.tsx
│   │           ├── students/new/page.tsx
│   │           ├── lecturers/page.tsx
│   │           ├── lecturers/new/page.tsx
│   │           └── profile/page.tsx
│   │
│   ├── components/                   # Shared across roles
│   │   └── ProtectedRoute.tsx
│   │
│   ├── context/
│   │   └── UserContext.tsx           # Auth state + ROLE_HOME
│   │
│   └── lib/
│       ├── api.ts                    # fetch wrapper → Express (to add)
│       ├── mockStudent.ts            # Delete after backend
│       ├── mockLecturer.ts
│       └── mockAdmin.ts
│
├── .env.local                        # NEXT_PUBLIC_API_URL=http://localhost:4000
└── package.json
```

---

## 5. Project Structure (Backend)

```
backend/                              # Express + TypeScript
├── src/
│   ├── index.ts                      # App entry — express(), cors, routes, listen
│   ├── config/
│   │   ├── env.ts                    # dotenv + type-safe env validation
│   │   └── prisma.ts                 # PrismaClient singleton
│   │
│   ├── middleware/
│   │   ├── auth.ts                   # verifyJWT — attaches req.user
│   │   ├── role.ts                   # requireRole("admin") — checks req.user.role
│   │   ├── validate.ts               # zod schema validation
│   │   └── error.ts                  # global error handler
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── student.routes.ts
│   │   ├── lecturer.routes.ts
│   │   ├── course.routes.ts
│   │   └── result.routes.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── student.controller.ts
│   │   ├── lecturer.controller.ts
│   │   ├── course.controller.ts
│   │   └── result.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts           # login logic, password compare, JWT sign
│   │   ├── student.service.ts
│   │   ├── lecturer.service.ts
│   │   ├── course.service.ts
│   │   └── result.service.ts         # grade computation
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts            # z.object({ regNo, password })
│   │   ├── student.schema.ts
│   │   ├── lecturer.schema.ts
│   │   └── result.schema.ts
│   │
│   └── types/
│       └── express.d.ts              # augment Request with `user`
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                       # seed one admin
│
├── .env                              # DATABASE_URL, JWT_SECRET, PORT=4000, CORS_ORIGIN
├── tsconfig.json
└── package.json
```

### Layered backend architecture

```
Request
  → middleware (cors, auth, role, validate)
  → controller (parses req, calls service, returns res)
  → service (business logic, grade computation)
  → repository (Prisma queries)
  → DB
```

Each layer has one responsibility. This is why we don't put DB calls in controllers — services are testable without HTTP, controllers without DB.

---

## 6. Roles & Permissions

| Capability | Student | Lecturer | Admin |
|-----------|:-------:|:--------:|:-----:|
| View own results | ✅ | — | ✅ |
| Enter/edit scores | ❌ | ✅ (own courses) | ❌ |
| Register users | ❌ | ❌ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Manage courses | ❌ | ❌ | ✅ |
| Suspend accounts | ❌ | ❌ | ✅ |

### Registration Number Formats

Role is **inferred from the number format** on login (mock). In production, the backend looks up the user and returns their role — the client never decides.

| Role | Format | Example |
|------|--------|---------|
| Student (ND) | `YYYY/YYYY/ND/DEPT/NNNN` | `2023/2024/ND/CS/1042` |
| Student (MTI) | `YYYY/YYYY/MTI/DEPT/NNNN` | `2023/2024/MTI/SF/2011` |
| Lecturer | `YYYY/YYYY/NUT/NNN` | `1999/2000/NUT/204` |
| Admin | `YYYY/YYYY/ADMIN/NNN` | `2023/2024/ADMIN/101` |

---

## 7. Authentication Flow

### Current (Mock — localStorage)

```
/login form submit
    │
    ▼
inferRole(regNo) → "student" | "lecturer" | "admin" | null
    │
    ▼
login({ id, name, role }) → localStorage.setItem("acadex_user")
    │
    ▼
router.push(ROLE_HOME[role])
```

`ProtectedRoute` on every role layout reads `useUser()`:
- `isLoading` → wait
- `!user` → `/login`
- wrong role → `ROLE_HOME[user.role]`
- correct → render children

### Planned (JWT against Express)

```
/login form submit
    │
    ▼
POST http://localhost:4000/api/auth/login  { regNo, password }
    │
    ▼
Express:
  - find user by identifier (regNo/staffNo/adminNo) in users table
  - bcrypt.compare(password, hash)
  - sign JWT: { userId, role }  → expires in 7d
  - return { user, token }
    │
    ▼
Frontend stores token (httpOnly cookie preferred, else localStorage)
UserContext.login(user) + api.ts sets Bearer header for future requests
    │
    ▼
router.push(ROLE_HOME[role])
```

### `ProtectedRoute` after backend

```tsx
useEffect(() => {
  if (isLoading) return;
  if (!user) {
    router.replace("/login");
    return;
  }
  if (!allowedRoles.includes(user.role)) {
    router.replace(ROLE_HOME[user.role]);
  }
}, [user, isLoading, router, allowedRoles]);
```

Same as now — no change. The token/session distinction is entirely inside `UserContext`.

---

## 8. Data Models (Mock)

### Student (`lib/mockStudent.ts`)

```typescript
interface CourseResult {
  code: string;
  title: string;
  units: number;
  score: number;      // 0–100
  grade: string;      // A–F
  remark: "Pass" | "Fail";
}

interface SemesterResult {
  session: string;    // "2024/2025"
  semester: "First" | "Second";
  level: string;      // "ND II"
  courses: CourseResult[];
}
```

### Lecturer (`lib/mockLecturer.ts`)

```typescript
interface EnrolledStudent {
  regNo: string;
  name: string;
  level: string;
  score: number | null;    // null = not yet entered
}

interface LecturerCourse {
  code: string;
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
  createdAt: string;
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

### Prisma Schema (planned)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  identifier   String   @unique      // regNo / staffNo / adminNo
  passwordHash String
  role         Role
  createdAt    DateTime @default(now())

  student      Student?
  lecturer     Lecturer?
}

model Student {
  id         Int    @id @default(autoincrement())
  userId     Int    @unique
  regNo      String @unique
  fullName   String
  program    String
  department String
  level      String
  email      String?
  status     String @default("active")

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  enrollments  Enrollment[]
}

model Lecturer {
  id         Int    @id @default(autoincrement())
  userId     Int    @unique
  staffNo    String @unique
  fullName   String
  department String
  rank       String?
  email      String?
  status     String @default("active")

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  courses     Course[]
  resultsIn   Result[]    @relation("EnteredBy")
}

model Course {
  id         Int    @id @default(autoincrement())
  code       String @unique
  title      String
  units      Int
  level      String?
  session    String
  semester   String
  lecturerId Int?

  lecturer    Lecturer?    @relation(fields: [lecturerId], references: [id])
  enrollments Enrollment[]
}

model Enrollment {
  id         Int @id @default(autoincrement())
  studentId  Int
  courseId   Int

  student  Student @relation(fields: [studentId], references: [id])
  course   Course  @relation(fields: [courseId], references: [id])
  result   Result?

  @@unique([studentId, courseId])
}

model Result {
  id           Int      @id @default(autoincrement())
  enrollmentId Int      @unique
  score        Decimal  @db.Decimal(5, 2)
  grade        String
  enteredById  Int
  enteredAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])
  enteredBy  Lecturer   @relation("EnteredBy", fields: [enteredById], references: [id])
}

enum Role {
  student
  lecturer
  admin
}
```

---

## 9. Pages & Routes

### Public

| Route | Purpose |
|-------|---------|
| `/` | Redirects based on auth state |
| `/login` | Login form |

### Student (`(students)`)

| Route | Purpose |
|-------|---------|
| `/students` | Dashboard (CGPA, stats, latest results) |
| `/students/results` | Full results — collapsible semesters with GPA |
| `/students/courses` | Registered courses list |
| `/students/profile` | Academic info + contact |

### Lecturer (`(lecturers)`)

| Route | Purpose |
|-------|---------|
| `/lecturers` | Dashboard (pending scores, assigned courses) |
| `/lecturers/courses` | Course grid with completion progress |
| `/lecturers/courses/[code]` | **Score entry form** |
| `/lecturers/profile` | Staff info |

### Admin (`(admin)`)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard (counts, quick actions) |
| `/admin/students` | Student list + search |
| `/admin/students/new` | Register student |
| `/admin/lecturers` | Lecturer list + search |
| `/admin/lecturers/new` | Register lecturer |
| `/admin/profile` | Admin account |

---

## 10. Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | `#f8fafc` | `#0b1120` | Page bg |
| `surface` | `#ffffff` | `#111827` | Cards |
| `foreground` | `#0f172a` | `#e2e8f0` | Body text |
| `muted` | `#64748b` | `#94a3b8` | Secondary text |
| `border` | `#e2e8f0` | `#1e293b` | Dividers |
| `primary` | `#1d4ed8` | `#3b82f6` | Buttons, links |
| `accent` | `#059669` | `#10b981` | Success |
| `warning` | `#d97706` | `#f59e0b` | Pending |
| `destructive` | `#dc2626` | `#ef4444` | Errors |

Tailwind usage: `bg-surface`, `text-muted`, `border-border`, `text-primary`.

### Typography

| Purpose | Font | Variable |
|---------|------|----------|
| Body | Inter | `--font-inter` |
| Display / headings | Plus Jakarta Sans | `--font-jakarta` |
| Numbers / codes | JetBrains Mono | `--font-jetbrains` |

---

## 11. Component Architecture

### Shell Pattern (identical across all three roles)

```
(role)/layout.tsx           → server component, `export const instant = false`
(role)/_components/
    RoleShell.tsx           → "use client", holds drawer state
    RoleSidebar.tsx         → desktop sidebar + mobile drawer
    RoleTopbar.tsx          → hamburger + user info
```

**Why the split?**

- `layout.tsx` must be a **server component** to export `instant = false` (illegal in client components — causes a build error)
- The shell needs `useState` for the drawer → client component
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

### `_components` vs `components`

| Location | Scope | Example |
|----------|-------|---------|
| `src/components/` | Shared across roles | `ProtectedRoute` |
| `src/app/(role)/_components/` | Role-private | `ScoreForm` |

Folders starting with `_` are excluded from routing by Next.js.

---

## 12. API Contract (Planned)

All endpoints under `http://localhost:4000/api`. JSON bodies. Auth via `Authorization: Bearer <jwt>` (or `httpOnly` cookie — pick one).

### Auth

| Method | Path | Body | Response | Auth |
|--------|------|------|----------|------|
| POST | `/api/auth/login` | `{ regNo, password }` | `{ user, token }` | public |
| GET | `/api/auth/me` | — | `{ user }` | any |
| POST | `/api/auth/logout` | — | `{ ok: true }` | any |

### Students

| Method | Path | Body | Auth |
|--------|------|------|------|
| GET | `/api/students` | — | admin |
| GET | `/api/students/:id` | — | admin |
| POST | `/api/students` | `{ regNo, fullName, program, department, level, email }` | admin |
| PATCH | `/api/students/:id` | partial | admin |
| DELETE | `/api/students/:id` | — | admin |
| GET | `/api/students/me/results` | — | student |

### Lecturers

| Method | Path | Body | Auth |
|--------|------|------|------|
| GET | `/api/lecturers` | — | admin |
| POST | `/api/lecturers` | `{ staffNo, fullName, department, rank, email }` | admin |
| PATCH | `/api/lecturers/:id` | partial | admin |
| GET | `/api/lecturers/me/courses` | — | lecturer |

### Courses

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/courses` | admin |
| GET | `/api/courses/:code/students` | lecturer (owner) |
| POST | `/api/courses` | admin |
| PATCH | `/api/courses/:id` | admin |
| POST | `/api/courses/:id/assign-lecturer` | admin |

### Results

| Method | Path | Body | Auth |
|--------|------|------|------|
| POST | `/api/courses/:code/scores` | `{ scores: [{ regNo, score }] }` | lecturer (owner) |
| GET | `/api/courses/:code/scores` | — | lecturer (owner) |
| GET | `/api/results/me` | — | student |

### Error format

```json
{ "error": "Human readable message", "fields": { "regNo": "Invalid format" } }
```

Status codes: `400` validation, `401` unauthenticated, `403` wrong role, `404` not found, `409` conflict (duplicate regNo), `500` server.

---

## 13. Known Limitations (Mock State)

| Limitation | Fix when backend arrives |
|-----------|--------------------------|
| Auth in `localStorage` | httpOnly cookie or JWT in memory |
| Password not validated | bcrypt on Express |
| Role inferred from regex | Express returns role from DB |
| Data from `mock*.ts` | Prisma + PostgreSQL |
| Form "Save" only updates local state | `POST` to Express |
| No pagination | `?page=N&limit=20` server-side |
| Print via `window.print()` | Server-side PDF |
| No audit log | `audit_log` table |
| No CORS config needed | Express needs `cors({ origin: "http://localhost:3000", credentials: true })` |
| Single user in mock | Seed script for full DB |

---

## 14. Backend Integration Plan

### Phase 1 — Backend scaffold

1. `npm init -y`, install `express cors dotenv bcrypt jsonwebtoken zod @prisma/client`
2. Install dev deps: `typescript tsx @types/express @types/cors @types/node @types/bcryptjs @types/jsonwebtoken prisma vitest supertest`
3. `tsconfig.json` with `outDir: dist`, `module: esnext` (or commonjs)
4. `src/index.ts`:
   ```ts
   import express from "express";
   import cors from "cors";
   import { env } from "./config/env";

   const app = express();
   app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
   app.use(express.json());

   app.get("/health", (_req, res) => res.json({ ok: true }));

   app.listen(env.PORT, () => console.log(`API on ${env.PORT}`));
   ```
5. Test with `curl http://localhost:4000/health`

### Phase 2 — Auth (unblocks everything)

1. `prisma/schema.prisma` with `User`, `Student`, `Lecturer`
2. `npx prisma migrate dev --name init`
3. `prisma/seed.ts` seeds one admin (`2023/2024/ADMIN/101`, password `admin123`)
4. Build `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
5. Test in Postman
6. **Frontend:** update `UserContext` to call Express
   ```tsx
   // context/UserContext.tsx
   useEffect(() => {
     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
       credentials: "include",
     })
       .then((r) => (r.ok ? r.json() : null))
       .then((data) => setUser(data?.user ?? null))
       .finally(() => setIsLoading(false));
   }, []);
   ```
7. **Frontend:** update `LoginPage` to `POST /api/auth/login`, remove `inferRole`

### Phase 3 — Admin CRUD

1. `POST /api/students`, `GET /api/students`, etc.
2. Wire `StudentForm` to `POST`
3. Wire `UsersTable` to `GET`

### Phase 4 — Lecturer score entry

1. `GET /api/lecturers/me/courses`
2. `POST /api/courses/:code/scores`
3. Wire `ScoreForm` `onSubmit` to POST

### Phase 5 — Student results

1. `GET /api/results/me`
2. Wire student results page

### Phase 6 — Polish

- Server-side PDF generation
- CSV export
- Email notifications
- Audit log
- Rate limiting + helmet

### Create `lib/api.ts` (frontend helper)

```ts
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}
```

Then every page uses `apiFetch<StudentRow[]>("/api/students")` instead of `mockStudent`.

### What Doesn't Change

- Every page under `app/(role)/*/page.tsx` — data source swaps but JSX is identical
- Every `_components/` file — they take props, not data sources
- Every `layout.tsx` — shell + guard stay identical
- Every form — swap mock `onCreated` for `apiFetch("/api/students", { method: "POST", ... })`

**Rule of thumb:** components never know *where* data comes from. Backend swap is surgical.

---

## 15. Testing Checklist

### Auth

- [ ] `/` with no user → `/login`
- [ ] `/` with student → `/students`
- [ ] `/` with lecturer → `/lecturers`
- [ ] `/` with admin → `/admin`
- [ ] `/students` logged out → `/login`
- [ ] `/students` as lecturer → `/lecturers`
- [ ] `/admin` as student → `/students`
- [ ] Logout clears session → `/login`
- [ ] Refresh on `/students` → stays logged in

### Login

- [ ] `2023/2024/ND/CS/1042` → `/students`
- [ ] `2023/2024/MTI/SF/2011` → `/students`
- [ ] `1999/2000/NUT/204` → `/lecturers`
- [ ] `2023/2024/ADMIN/101` → `/admin`
- [ ] `random-text` → inline error
- [ ] Empty password → inline error
- [ ] Show/Hide toggle

### Student

- [ ] Dashboard shows CGPA, counts, latest result
- [ ] Results page: collapse/expand, GPA matches manual calc
- [ ] Courses page lists all courses
- [ ] Profile edit → save → notice

### Lecturer

- [ ] Dashboard shows pending per course
- [ ] Course detail loads correct students
- [ ] Score `85` → A, `72` → B, `49` → F
- [ ] Score `105` or `-1` → inline error
- [ ] Clear score → grade `—`
- [ ] Save → dirty clears, toast appears

### Admin

- [ ] Dashboard counts match mock
- [ ] Search filters lists
- [ ] Register valid student → success + redirect
- [ ] Invalid regNo → inline error
- [ ] RegNoField shows live preview

### Responsive

- [ ] All pages work at 375px
- [ ] Sidebar hidden below `md`, hamburger shown
- [ ] Drawer opens/closes, link navigates + closes
- [ ] Tables scroll horizontally

### Backend (when live)

- [ ] `POST /api/auth/login` with valid/invalid creds
- [ ] `GET /api/auth/me` with/without token
- [ ] `POST /api/students` as admin succeeds, as student returns 403
- [ ] Duplicate regNo returns 409
- [ ] CORS preflight from `localhost:3000` succeeds
- [ ] JWT expiry returns 401, frontend redirects to `/login`

---

## 16. Design Decisions

### Why decoupled frontend + Express?

- **Portfolio clarity** — the interviewer sees you know both stacks
- **Backend testable independently** — `supertest` against Express without React
- **Real-world pattern** — most production systems aren't monolithic Next.js
- **The frontend stays Next.js** — you still get SSR, route groups, server components

### Why route groups (`(students)`, `(lecturers)`, `(admin)`)?

- Share a shell layout per role without adding a URL segment
- Keep role-private components in `_components` next to their routes
- Enforce role guards at layout level (one guard, all pages protected)

### Why `_components` vs `components`?

Next.js excludes `_`-prefixed folders from routing. So `_components` never becomes a URL, and we get a clean boundary between shared and private code. Deleting a role later is `rm -rf (role)/`.

### Why `instant = false` in layout?

Next.js 16.3 validates instant navigation. When a layout wraps children in a client guard that can return `null` during loading, `{children}` is "dropped from rendering" and Next.js warns. `instant = false` opts out — legal **only in server components**, which is why `layout.tsx` (server) is split from `XShell.tsx` (client).

### Why `ROLE_HOME` map?

```tsx
const ROLE_HOME: Record<Role, string> = {
  student: "/students",
  lecturer: "/lecturers",
  admin: "/admin",
};
```

Adding a 4th role is one line, not a nested ternary. Exported from `UserContext`, used by both `LoginPage` and `ProtectedRoute`.

### Why CORS on Express?

Frontend on `:3000`, backend on `:4000` — different origins. Without `cors({ origin: "http://localhost:3000", credentials: true })`, the browser blocks the request. `credentials: true` is required if you use cookies; if you use Bearer tokens in `Authorization`, you can drop `credentials: true` but you still need the `origin` and `allowedHeaders: ["Authorization"]`.

### Why JWT over sessions for this project?

- **Academic simplicity** — one token, no session table
- **Stateless** — Express can restart without logging everyone out
- **Frontend-friendly** — attach `Authorization: Bearer` in one place

For production, prefer **httpOnly cookies** (XSS-resistant). For this project, either is fine — document the choice.

### Why Tailwind with semantic tokens?

```tsx
// ❌ Fragile — JIT can't see `text-${align}` at build time
className={`text-${align}`}

// ✅ Safe
const alignClass = { left: "text-left", center: "text-center", right: "text-right" };
className={alignClass[align]}
```

Dynamic class construction breaks Tailwind's static extraction.

---

## 17. Setup & Running

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or Docker)

### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
npm run dev
# → http://localhost:3000
```

### Backend

```bash
cd backend
npm install
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/acadex" > .env
echo "JWT_SECRET=change-me-in-production" >> .env
echo "PORT=4000" >> .env
echo "CORS_ORIGIN=http://localhost:3000" >> .env

npx prisma migrate dev --name init
npx prisma db seed
npm run dev   # tsx watch src/index.ts
# → http://localhost:4000
```

### Test logins (mock frontend)

| Role | Number | Password |
|------|--------|----------|
| Student | `2023/2024/ND/CS/1042` | any |
| Lecturer | `1999/2000/NUT/204` | any |
| Admin | `2023/2024/ADMIN/101` | any |

### Test logins (after backend seed)

| Role | Number | Password |
|------|--------|----------|
| Admin | `2023/2024/ADMIN/101` | `admin123` |

(Students/lecturers get accounts when admin registers them.)

### Reset mock auth state

DevTools → Application → Local Storage → delete `acadex_user` → refresh.

---

## 18. Roadmap

### Done

- [x] Next.js scaffold + design tokens
- [x] Auth context + `ProtectedRoute` + `ROLE_HOME`
- [x] Login page with role inference
- [x] Student section (4 pages + mobile drawer)
- [x] Lecturer section (4 pages + score form + mobile drawer)
- [x] Admin section (6 pages + forms + mobile drawer)
- [x] Mock data for all roles

### Backend

- [ ] Express + TS scaffold + `/health`
- [ ] Prisma schema + migrate + seed
- [ ] `/api/auth/*` with JWT + bcrypt
- [ ] `/api/students` CRUD
- [ ] `/api/lecturers` CRUD
- [ ] `/api/courses` + enrollment
- [ ] `/api/results` with server-side grade computation
- [ ] CORS + helmet + rate limit
- [ ] Vitest + Supertest coverage

### Frontend integration

- [ ] `lib/api.ts` fetch wrapper
- [ ] `UserContext` calls `/api/auth/me`
- [ ] `LoginPage` calls `/api/auth/login`
- [ ] `StudentForm`/`LecturerForm` POST
- [ ] `ScoreForm` POSTs scores
- [ ] Student pages `GET /api/results/me`
- [ ] Delete `mock*.ts`

### Future

- [ ] Server-side PDF result slips
- [ ] CSV bulk import
- [ ] Email notifications
- [ ] Audit log
- [ ] Password reset
- [ ] Moderation workflow (submit → approve → publish)
- [ ] Analytics dashboard
- [ ] SMS notifications
- [ ] Multi-tenancy

---

## Appendix A — Common Pitfalls

### "This page could not be found" at `/`

Missing `app/page.tsx`. Route groups don't create URLs — `/` needs its own page.

### "`instant` field" build error

Exported `instant` from a client component. Move it to a server `layout.tsx`.

### "Module has no exported member `StatusPill`"

Export it from `UsersTable.tsx` or create `StatusPill.tsx`. Pick one.

### Dynamic Tailwind classes don't work

Use a lookup map, not `text-${align}`.

### Login works but dashboard 404s

Inner folder name defines URL. `(students)/students/page.tsx` → `/students`, not `/dashboard`.

### CORS error in browser console

Express needs:
```ts
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
```
And frontend `fetch` needs `credentials: "include"` if using cookies.

### 401 on every request after login

If using cookies, `cors credentials: true` must be set **and** the cookie must have `sameSite: "none"` + `secure: true` (or `lax` for `localhost`). If using Bearer, check the `Authorization` header is actually attached by `apiFetch`.

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

Case-insensitive (`i`). Add `HND|BSc` later by extending the alternation.

---

## Appendix C — Grade Scale

| Score | Grade | Point | Remark |
|-------|-------|-------|--------|
| 70–100 | A | 5 | Pass |
| 60–69 | B | 4 | Pass |
| 50–59 | C | 3 | Pass |
| 45–49 | D | 2 | Pass |
| 40–44 | E | 1 | Pass |
| 0–39 | F | 0 | Fail |

**GPA:** `Σ(grade_point × units) / Σ(units)`

Used in `students/results/page.tsx` (`semesterGPA`) and `lecturers/_components/ScoreForm.tsx` (`gradeFromScore`). When backend arrives, **compute on the server** — never trust client-supplied grades.

---

## Appendix D — Backend Packages

```bash
# prod
npm i express cors dotenv bcrypt jsonwebtoken zod @prisma/client

# dev
npm i -D typescript tsx @types/express @types/cors @types/node \
         @types/bcrypt @types/jsonwebtoken prisma \
         vitest supertest @types/supertest
```

| Package | Purpose |
|---------|---------|
| `express` | HTTP framework |
| `cors` | Cross-origin requests from Next.js |
| `dotenv` | Env loading |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT sign/verify |
| `zod` | Request body validation |
| `@prisma/client` | DB access |
| `prisma` | CLI (migrations, generate, studio) |
| `tsx` | Run `.ts` directly in dev |
| `vitest` + `supertest` | API tests |

### Minimal `src/index.ts`

```ts
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);

app.use((err: any, _req: express.Request, res: express.Response) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: err.message ?? "Server error" });
});

app.listen(env.PORT, () =>
  console.log(`API → http://localhost:${env.PORT}`)
);
```

### Minimal `src/config/env.ts`

```ts
import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export const env = schema.parse(process.env);
```

### Minimal `/api/auth/login`

```ts
// routes/auth.routes.ts
import { Router } from "express";
import { login } from "../controllers/auth.controller";
const router = Router();
router.post("/login", login);
export default router;

// controllers/auth.controller.ts
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const schema = z.object({
  regNo: z.string(),
  password: z.string().min(1),
});

export async function login(req: Request, res: Response) {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { regNo, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { identifier: regNo },
    include: { student: true, lecturer: true },
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const name =
    user.student?.fullName ?? user.lecturer?.fullName ?? "Administrator";

  res.json({
    user: { id: user.identifier, name, role: user.role },
    token,
  });
}
```

That's the shape — production needs rate limiting, CSRF (if cookies), and refresh-token rotation, but this proves the contract.

---

*Last updated: frontend complete, Express + TS backend pending. Questions → contact the author.*