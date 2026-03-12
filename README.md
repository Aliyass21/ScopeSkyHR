# CoreHR

A polished, full-featured **Human Resources Management System** demo built as a frontend showcase. Designed to demonstrate enterprise-grade UI/UX capabilities to clients, with a complete mockup API — no backend required.

---

## Overview

CoreHR simulates a real HR platform with 8 functional modules covering the full employee lifecycle: from recruitment and onboarding to attendance tracking, payroll, and org management. All data is local (JSON files), and all API calls are simulated with realistic delays and loading states.

**Primary language:** Arabic (RTL) — English fully supported via language toggle.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript (Vite) |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | react-router-dom v7 |
| State | Zustand |
| Forms | react-hook-form + Zod |
| Charts | Recharts |
| i18n | i18next + react-i18next |
| Dates | date-fns |
| Toasts | Sonner |
| Icons | Lucide React |

---

## Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Dashboard** | KPI widgets, headcount chart, recent activity feed |
| 2 | **Employees** | Employee list, profiles, create/edit forms, face photo upload |
| 3 | **Attendance** | Clock-in/out, face recognition check-in, monthly grid view |
| 4 | **Leave Management** | Leave requests, approval workflow, balance tracker, calendar |
| 5 | **Payroll** | Salary slips, payroll run simulation, monthly reports |
| 6 | **Recruitment** | Job board, applicant Kanban pipeline, job posting forms |
| 7 | **Org Chart** | Interactive hierarchy tree (3+ levels deep) |
| 8 | **Settings** | Company profile, users & roles, language preferences |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Project Structure

```
src/
├── api/              # Mockup API — one file per domain (no real HTTP calls)
│   ├── employees.ts
│   ├── attendance.ts
│   ├── leave.ts
│   ├── payroll.ts
│   ├── recruitment.ts
│   └── faceRecognition.ts
│
├── components/
│   ├── ui/           # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── layout/       # AppShell, Sidebar, Header, PageWrapper, Breadcrumb
│   ├── shared/       # StatCard, EmptyState, LoadingSkeleton, ConfirmDialog
│   ├── dashboard/    # StatsRow, HeadcountChart, ActivityFeed
│   ├── employees/    # EmployeeTable, EmployeeForm, EmployeeProfile, FaceCapture
│   ├── attendance/   # AttendanceGrid, ClockInPanel, FaceScanner
│   ├── leave/        # LeaveRequestForm, LeaveCalendar, LeaveBalanceCard
│   ├── payroll/      # PaySlip, PayrollTable, PayrollRunButton
│   ├── recruitment/  # JobBoard, ApplicantKanban, JobForm
│   └── orgchart/     # OrgTree, OrgNode
│
├── data/             # Static JSON mock data (employees, attendance, leave, etc.)
├── hooks/            # Custom React hooks (useEmployees, useAttendance, etc.)
├── i18n/             # i18next configuration
├── locales/
│   ├── ar.json       # Arabic translations (primary)
│   └── en.json       # English translations
├── pages/            # Route-level page components (thin wrappers)
├── store/            # Zustand global state stores
├── types/            # TypeScript interfaces & enums
└── utils/            # Helpers: mockDelay, formatters, faceUtils
```

---

## Mock Data

All data is seeded and ready for demo use:

- **12 employees** (EMP-0001 to EMP-0012) — Gulf-region Arabic names, SAR salaries (10,000–32,000)
- **3+ months** of attendance records
- **Leave requests** in all statuses: pending, approved, rejected
- **Payroll records** for 2+ months
- **2+ open job postings** with applicants in the Kanban pipeline
- **Demo user:** EMP-0001 (Mohammed Al-Ghamdi)

---

## Internationalization

- Arabic is the **default language** with full RTL layout
- Switch to English via the language toggle in the header
- Direction is controlled via the `dir` attribute on `<html>`
- Fonts: `Cairo` for Arabic, `Inter` for English
- All UI strings are translation keys — nothing is hardcoded

---

## Face Recognition (Mockup)

The attendance module includes a webcam-based face check-in feature:

1. Camera opens and captures a snapshot
2. The snapshot is compared against the employee's stored `faceDescriptor` (mock float array)
3. A match triggers a successful clock-in (90% success rate for demo purposes)
4. If no camera is available, a graceful fallback UI is shown

> This is a **client-side only mockup** — no biometric data is transmitted or stored.

---

## Theming

Four built-in themes selectable from the header:

| Theme | Description |
|-------|-------------|
| Default | Deep indigo + teal accent |
| Dark | Dark mode variant of default |
| Light Green | Fresh green palette |
| Dark Green | Dark mode green variant |

---

## Design Principles

- **Demo-ready at all times** — every page renders cleanly, even with empty data
- **Loading skeletons** on all lists and tables
- **Toast notifications** for every create/update/delete action
- **Confirmation dialogs** for all destructive operations
- **Inline form validation** with Arabic error messages
- **Fully responsive** — tested from 375px (mobile) to 1536px (2xl desktop)

---

## Notes

- This is a **frontend-only demo** — there is no backend, database, or authentication server
- All "API calls" are async functions reading local JSON with a simulated 300–600ms delay
- Do not use `localStorage` as a database — the mock store holds runtime state in memory
- The demo resets on page refresh (by design)
