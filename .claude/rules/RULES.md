# CoreHR — Rules & Conventions

These rules are **non-negotiable**. Every PR and every generated file must comply.

---

## 🌐 Internationalization (i18n)

| Rule | Detail |
|------|--------|
| **No hardcoded strings** | Every visible string uses `t('key')` |
| **Both locales updated together** | Adding a key to `ar.json` must be matched in `en.json` in the same change |
| **Key naming** | `module.sub.description` — e.g., `employees.table.noResults` |
| **RTL direction** | Set `document.documentElement.dir` on language change |
| **Number display** | Use Western digits by default; expose a toggle if client wants Arabic-Indic |
| **Date display** | Format with `date-fns/locale/ar-SA` or `en-US` depending on active lang |

---

## 🎨 Styling

| Rule | Detail |
|------|--------|
| **CSS variables only** | All colors from `globals.css` variables, never raw hex in className |
| **No inline styles** | Exception: truly dynamic values (e.g., `style={{ width: progress + '%' }}`) |
| **Tailwind classes** | Use utility classes; group by: layout → spacing → color → typography → state |
| **RTL-safe spacing** | Use `ms-` / `me-` (margin-start/end) not `ml-` / `mr-` |
| **Responsive** | Every component works from `sm` (375px) through `2xl` (1536px) |
| **Dark mode** | Not required for v1, but use `dark:` classes where trivial to add |

---

## 🧩 Components

| Rule | Detail |
|------|--------|
| **Single responsibility** | Each component does one thing; max ~150 lines |
| **Explicit prop types** | No `any`, no implicit `children: any` |
| **Named exports** | Prefer named exports; `default export` only for page-level components |
| **shadcn first** | Always check shadcn/ui before writing custom UI primitives |
| **Composition** | Prefer small composable pieces over monolithic components |
| **Error boundaries** | Wrap page-level components in `<ErrorBoundary>` |

```tsx
// ✅ Good
interface EmployeeCardProps {
  employee: Employee
  onEdit: (id: string) => void
  compact?: boolean
}
export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onEdit, compact = false }) => { ... }

// ❌ Bad
export default function Card(props: any) { ... }
```

---

## 📁 File Structure

```
src/
├── api/              # Mockup API — one file per domain
│   ├── employees.ts
│   ├── attendance.ts
│   ├── leave.ts
│   ├── payroll.ts
│   ├── recruitment.ts
│   └── faceRecognition.ts
│
├── components/
│   ├── ui/           # shadcn-generated — DO NOT EDIT manually
│   ├── layout/       # Shell, Sidebar, Header, PageWrapper, Breadcrumb
│   ├── shared/       # StatCard, EmptyState, LoadingSkeleton, ConfirmDialog
│   ├── employees/    # EmployeeTable, EmployeeForm, EmployeeProfile, FaceCapture
│   ├── attendance/   # AttendanceGrid, ClockInPanel, FaceScanner
│   ├── leave/        # LeaveRequestForm, LeaveCalendar, LeaveBalanceCard
│   ├── payroll/      # PaySlip, PayrollTable, PayrollRunButton
│   ├── recruitment/  # JobBoard, ApplicantKanban, JobForm
│   ├── orgchart/     # OrgTree, OrgNode
│   └── dashboard/    # StatsRow, ActivityFeed, HeadcountChart
│
├── data/             # Static JSON mock data
├── hooks/            # useEmployees, useAttendance, useDebounce, etc.
├── i18n/             # i18next configuration
├── locales/
│   ├── ar.json
│   └── en.json
├── pages/            # Route-level components (thin wrappers)
├── store/            # Zustand stores
├── types/            # TypeScript interfaces & enums
└── utils/            # mockDelay, formatters, faceUtils
```

**Rule**: new domain → create matching files in `api/`, `data/`, `types/`, `store/`, `components/`, `pages/`, and both `locales/`.

---

## 🔒 TypeScript

```ts
// ✅ All model types in src/types/
export interface Employee {
  id: string                    // EMP-0001
  nameAr: string
  nameEn: string
  email: string
  department: DepartmentId      // string union or enum
  status: EmployeeStatus        // 'active' | 'inactive' | 'onleave'
  avatarUrl?: string
  faceDescriptor?: number[]     // 128-element mock array
  // ...
}

// ✅ Use Zod for forms
const employeeSchema = z.object({
  nameAr: z.string().min(2, t('validation.required')),
  email: z.string().email(t('validation.invalidEmail')),
  // ...
})
```

---

## 🧪 Mock Data Rules

1. **Minimum 10 employees** in `employees.json` across multiple departments
2. **Minimum 3 months** of attendance records
3. **At least 2 open jobs** in recruitment
4. **Leave requests** in all statuses: pending, approved, rejected
5. **Payroll records** for at least 2 months
6. All Arabic names must be authentic Gulf-region names
7. All salaries in SAR, realistic for Gulf market (8,000–35,000 SAR range)

---

## 🎭 Demo-Readiness Rules

These rules exist specifically because this is a **client demo**:

1. **No broken states** — every page must render without errors, even with empty data
2. **Loading skeletons** — every list/table shows a skeleton for first 400ms
3. **Success toasts** — every mutation (create/update/delete) shows a `sonner` toast
4. **Confirmation dialogs** — destructive actions require confirmation
5. **Form validation** — all forms validate and show inline Arabic error messages
6. **Face recognition must work** — even if it "always succeeds" for demo purposes
7. **Charts must have data** — seed chart data so graphs look meaningful, not flat lines
8. **Org chart** — must show at least 3 levels deep

---

## 🚫 Forbidden Patterns

```ts
// ❌ Never use localStorage as database
localStorage.setItem('employees', JSON.stringify(data))

// ❌ Never hardcode strings
<p>No employees found</p>

// ❌ Never use any
const handler = (data: any) => { ... }

// ❌ Never call real APIs
const res = await fetch('https://api.example.com/employees')

// ❌ Never mutate JSON imports directly
import data from '@/data/employees.json'
data.push(newEmployee) // ❌ mutates the module

// ✅ Clone first
let store = [...data] // ✅
```

---

## ✅ Pull Request Checklist

Before considering any change complete, verify:

- [ ] All new UI strings added to both `ar.json` and `en.json`
- [ ] Component renders correctly in RTL (Arabic) mode
- [ ] Component renders correctly in LTR (English) mode
- [ ] Loading state is handled
- [ ] Empty state is handled
- [ ] Error state is handled
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Tested at mobile (375px) and desktop (1280px) widths
- [ ] Form validation messages appear in Arabic
- [ ] Mutations trigger a toast notification