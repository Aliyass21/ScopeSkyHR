# CoreHR Mockup API — SKILL.md

## Philosophy
All data is local. The API layer (`src/api/`) provides async functions that:
1. Read from `src/data/*.json`
2. Simulate realistic network delay (300–600ms)
3. Return typed responses
4. Occasionally simulate errors (1 in 20 calls) for demo robustness

No `fetch()` to real endpoints. No `localStorage` as primary storage.
State is held in Zustand stores, seeded from JSON on app load.

---

## Delay Helper

```ts
// src/utils/mockDelay.ts
export const delay = (ms = 400) =>
  new Promise<void>(resolve => setTimeout(resolve, ms + Math.random() * 200))

export const mockError = () => Math.random() < 0.05 // 5% random error rate
```

---

## API Function Template

```ts
// src/api/employees.ts
import type { Employee, CreateEmployeeDto } from '@/types/employee'
import employeesData from '@/data/employees.json'
import { delay } from '@/utils/mockDelay'

let store: Employee[] = employeesData as Employee[]

export const getEmployees = async (): Promise<Employee[]> => {
  await delay()
  return [...store]
}

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  await delay(200)
  return store.find(e => e.id === id) ?? null
}

export const createEmployee = async (dto: CreateEmployeeDto): Promise<Employee> => {
  await delay(500)
  const newEmployee: Employee = {
    ...dto,
    id: `EMP-${String(store.length + 1).padStart(4, '0')}`,
    createdAt: new Date().toISOString(),
    faceDescriptor: generateMockDescriptor(),
  }
  store = [...store, newEmployee]
  return newEmployee
}

export const updateEmployee = async (id: string, dto: Partial<Employee>): Promise<Employee> => {
  await delay(400)
  store = store.map(e => e.id === id ? { ...e, ...dto, updatedAt: new Date().toISOString() } : e)
  return store.find(e => e.id === id)!
}

export const deleteEmployee = async (id: string): Promise<void> => {
  await delay(300)
  store = store.filter(e => e.id !== id)
}
```

---

## Data Files

### `src/data/employees.json`
```json
[
  {
    "id": "EMP-0001",
    "nameAr": "أحمد سعد الزهراني",
    "nameEn": "Ahmed Saad Al-Zahrani",
    "email": "ahmed.zahrani@corehr.sa",
    "phone": "+966 50 123 4567",
    "department": "engineering",
    "position": "مهندس برمجيات أول",
    "positionEn": "Senior Software Engineer",
    "salary": 18000,
    "currency": "SAR",
    "hireDate": "2022-03-15",
    "status": "active",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed",
    "faceDescriptor": [0.12, -0.34, 0.56, 0.78, -0.11, 0.23, 0.45, -0.67],
    "managerId": "EMP-0003",
    "gender": "male",
    "nationalId": "1098765432",
    "nationality": "سعودي",
    "leaveBalance": { "annual": 21, "sick": 14, "used": 5 }
  }
]
```

### `src/data/departments.json`
```json
[
  { "id": "engineering", "nameAr": "الهندسة والتقنية", "nameEn": "Engineering", "headId": "EMP-0003", "color": "#4F46E5" },
  { "id": "hr", "nameAr": "الموارد البشرية", "nameEn": "Human Resources", "headId": "EMP-0002", "color": "#0EA5E9" },
  { "id": "finance", "nameAr": "المالية والمحاسبة", "nameEn": "Finance", "headId": "EMP-0004", "color": "#10B981" },
  { "id": "operations", "nameAr": "العمليات", "nameEn": "Operations", "headId": "EMP-0005", "color": "#F59E0B" },
  { "id": "marketing", "nameAr": "التسويق", "nameEn": "Marketing", "headId": "EMP-0006", "color": "#EC4899" }
]
```

### `src/data/attendance.json`
```json
[
  {
    "id": "ATT-00001",
    "employeeId": "EMP-0001",
    "date": "2025-06-01",
    "checkIn": "08:02",
    "checkOut": "17:15",
    "status": "present",
    "method": "face_recognition",
    "lateMinutes": 2,
    "overtimeMinutes": 75
  }
]
```

### `src/data/leaveRequests.json`
```json
[
  {
    "id": "LV-0001",
    "employeeId": "EMP-0001",
    "type": "annual",
    "startDate": "2025-07-01",
    "endDate": "2025-07-10",
    "days": 10,
    "status": "approved",
    "reason": "إجازة سنوية",
    "approvedBy": "EMP-0003",
    "appliedAt": "2025-06-15T10:30:00Z"
  }
]
```

### `src/data/payroll.json`
```json
[
  {
    "id": "PAY-202506-0001",
    "employeeId": "EMP-0001",
    "month": "2025-06",
    "basicSalary": 18000,
    "housingAllowance": 3600,
    "transportAllowance": 800,
    "deductions": 900,
    "gosi": 1800,
    "netSalary": 19700,
    "status": "paid",
    "paidAt": "2025-06-28T00:00:00Z"
  }
]
```

### `src/data/jobs.json` (Recruitment)
```json
[
  {
    "id": "JOB-001",
    "titleAr": "مطور واجهات أمامية",
    "titleEn": "Frontend Developer",
    "department": "engineering",
    "type": "full_time",
    "status": "open",
    "postedAt": "2025-05-20",
    "closingDate": "2025-07-20",
    "applicantsCount": 24,
    "descriptionAr": "نبحث عن مطور واجهات أمامية متمرس..."
  }
]
```

---

## Face Recognition Mock

```ts
// src/api/faceRecognition.ts
import type { Employee } from '@/types/employee'
import { getEmployees } from './employees'
import { delay } from '@/utils/mockDelay'

/** Generates a consistent mock descriptor based on employee ID */
export const generateMockDescriptor = (seed = Math.random()): number[] =>
  Array.from({ length: 128 }, (_, i) => Math.sin(seed * (i + 1)) * 0.5)

/** Cosine similarity between two descriptor arrays */
const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0)
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0))
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0))
  return dot / (magA * magB)
}

export interface FaceMatchResult {
  matched: boolean
  employee?: Employee
  confidence: number
}

/**
 * Mock face verification:
 * In real app this would compare face-api.js descriptors.
 * Here we simulate: always matches the first active employee for demo.
 */
export const verifyFace = async (
  capturedDescriptor: number[]
): Promise<FaceMatchResult> => {
  await delay(1200) // simulate processing time
  const employees = await getEmployees()
  const active = employees.filter(e => e.status === 'active')

  // Demo: deterministically match based on similarity
  let bestMatch: { employee: Employee; score: number } | null = null
  for (const emp of active) {
    if (!emp.faceDescriptor) continue
    const score = cosineSimilarity(capturedDescriptor, emp.faceDescriptor)
    if (!bestMatch || score > bestMatch.score) bestMatch = { employee: emp, score }
  }

  const THRESHOLD = 0.7
  if (bestMatch && bestMatch.score >= THRESHOLD) {
    return { matched: true, employee: bestMatch.employee, confidence: bestMatch.score }
  }
  return { matched: false, confidence: bestMatch?.score ?? 0 }
}
```

---

## Zustand Store Template

```ts
// src/store/employeeStore.ts
import { create } from 'zustand'
import type { Employee } from '@/types/employee'
import * as employeeApi from '@/api/employees'

interface EmployeeState {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  fetchEmployees: () => Promise<void>
  addEmployee: (dto: CreateEmployeeDto) => Promise<void>
  updateEmployee: (id: string, dto: Partial<Employee>) => Promise<void>
  removeEmployee: (id: string) => Promise<void>
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null })
    try {
      const employees = await employeeApi.getEmployees()
      set({ employees, isLoading: false })
    } catch (err) {
      set({ error: 'فشل تحميل الموظفين', isLoading: false })
    }
  },

  addEmployee: async (dto) => {
    const employee = await employeeApi.createEmployee(dto)
    set(s => ({ employees: [...s.employees, employee] }))
  },

  updateEmployee: async (id, dto) => {
    const updated = await employeeApi.updateEmployee(id, dto)
    set(s => ({ employees: s.employees.map(e => e.id === id ? updated : e) }))
  },

  removeEmployee: async (id) => {
    await employeeApi.deleteEmployee(id)
    set(s => ({ employees: s.employees.filter(e => e.id !== id) }))
  },
}))
```