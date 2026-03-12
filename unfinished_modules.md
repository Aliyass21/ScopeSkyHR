# CoreHR — Unfinished Modules

These modules currently render a "Coming Soon" placeholder. Each section below describes
the full feature set and acceptance criteria needed to complete them.

---

## 1. Payroll Module

**Route:** `/payroll`

### Features to Build
- **Salary Slips List** — Table of all generated payslips per month per employee
- **Payroll Run** — "Run Payroll" button that generates payslips for a selected month
- **Payslip Detail** — Printable/downloadable PDF-style payslip showing:
  - Basic salary, allowances (housing, transport), deductions, net pay
  - Employee info, month/year, pay date
- **Payroll Summary** — Aggregate stats: total payroll cost, headcount, average salary by dept

### Mock Data to Add
- `src/data/payroll.json` — 2 months of payroll records (February + March 2026)
- Each record: `{ id, employeeId, month, year, basicSalary, housing, transport, deductions, netPay, status: 'pending' | 'processed' }`

### API to Add
- `src/api/payroll.ts` — `getPayrollRecords()`, `runPayroll(month, year)`, `getPayslip(id)`

### Types to Add
- `src/types/payroll.ts` — `PayrollRecord`, `PayrollRunInput`

### Components to Build
- `src/components/payroll/PayrollTable.tsx`
- `src/components/payroll/PaySlip.tsx`
- `src/components/payroll/PayrollRunButton.tsx`
- `src/components/payroll/PayrollSummary.tsx`

### Acceptance Criteria
- [ ] Table shows all employees with their latest payslip status
- [ ] "Run Payroll" generates records and shows success toast
- [ ] Payslip modal renders all salary breakdown fields
- [ ] RTL layout works correctly in payslip
- [ ] Loading and empty states handled

---

## 2. Recruitment Module

**Route:** `/recruitment`

### Features to Build
- **Job Board** — List of open positions with status, department, number of applicants
- **Job Form** — Create / edit job posting (title, department, description, requirements, deadline)
- **Applicant Pipeline (Kanban)** — Drag-and-drop board with columns:
  - Applied → Screening → Interview → Offer → Hired / Rejected
- **Applicant Profile** — View applicant details, resume link (mock), stage history

### Mock Data to Add
- `src/data/jobs.json` — 3 open positions, 1 closed
- `src/data/applicants.json` — 8 applicants spread across pipeline stages

### API to Add
- `src/api/recruitment.ts` — `getJobs()`, `createJob()`, `getApplicants(jobId?)`, `moveApplicant(id, stage)`

### Types to Add
- `src/types/recruitment.ts` — `Job`, `Applicant`, `PipelineStage`

### Components to Build
- `src/components/recruitment/JobBoard.tsx`
- `src/components/recruitment/JobForm.tsx`
- `src/components/recruitment/ApplicantKanban.tsx`
- `src/components/recruitment/ApplicantCard.tsx`

### Acceptance Criteria
- [ ] Job list shows all positions with applicant count badge
- [ ] Creating a new job adds it to the list with toast
- [ ] Kanban columns scroll independently when many cards
- [ ] Moving a card updates its stage immediately (optimistic)
- [ ] RTL Kanban columns display correctly

---

## 3. Org Chart Module

**Route:** `/orgchart`

### Features to Build
- **Interactive Tree** — Visual hierarchy showing CEO → departments → employees
- **Node Details** — Click a node to see employee info panel (avatar, title, email)
- **Zoom / Pan** — Mouse/touch drag to navigate large trees
- **Collapse/Expand** — Toggle department branches
- **Export** — "Export as PNG" button (canvas capture)

### Data Source
- Derive the org tree from the existing `employees.json` using `managerId` field
- Root node: company "CoreHR" → HR Manager (EMP-0002) → departments

### Types to Add
- `src/types/orgchart.ts` — `OrgNode`, `OrgTree`

### Components to Build
- `src/components/orgchart/OrgTree.tsx` — recursive tree renderer
- `src/components/orgchart/OrgNode.tsx` — individual employee node card
- `src/components/orgchart/OrgZoomControls.tsx`

### Suggested Libraries
- `react-d3-tree` or `@xyflow/react` (React Flow) for the interactive canvas
- `html-to-image` for PNG export

### Acceptance Criteria
- [ ] Tree renders at least 3 levels: Company → HR/Dept → Employees
- [ ] Clicking a node opens a detail sidebar
- [ ] Collapse/expand works per branch
- [ ] Tree is readable in both RTL and LTR
- [ ] Minimum 3 departments shown in demo

---

## 4. Settings Module

**Route:** `/settings`

### Features to Build
- **Company Profile** — Edit company name, logo, address, timezone, fiscal year start
- **Users & Roles** — Simple role table: Admin, HR Manager, Employee (read-only for demo)
- **Language & Locale** — Language selector (ar/en) with immediate preview
- **Notification Preferences** — Toggle email/in-app notifications per event type
- **Appearance** — Theme color picker (primary color) + dark mode toggle

### Mock Data to Add
- `src/data/company.json` — company profile fields
- `src/data/roles.json` — role definitions

### API to Add
- `src/api/settings.ts` — `getCompanyProfile()`, `updateCompanyProfile()`, `getRoles()`

### Types to Add
- `src/types/settings.ts` — `CompanyProfile`, `Role`, `UserRole`

### Components to Build
- `src/components/settings/CompanyProfileForm.tsx`
- `src/components/settings/RolesTable.tsx`
- `src/components/settings/LanguageSettings.tsx`
- `src/components/settings/AppearanceSettings.tsx`

### Acceptance Criteria
- [ ] Company profile saves and shows toast confirmation
- [ ] Language change applies immediately across all UI
- [ ] Roles table is read-only in demo mode with info tooltip
- [ ] All form labels/messages in Arabic when Arabic is active
- [ ] Settings persist in Zustand store for session duration

---

## Priority Order

| Priority | Module | Reason |
|---|---|---|
| 1 | Settings | Language + appearance affects whole app |
| 2 | Payroll | High client interest for HR demo |
| 3 | Recruitment | Visually impressive Kanban |
| 4 | Org Chart | Nice-to-have, complex implementation |
