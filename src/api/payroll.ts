import { mockDelay } from '@/utils/mockDelay'
import rawData from '@/data/payroll.json'
import { getEmployees } from '@/api/employees'
import type { PayrollRecord, PayrollRunInput } from '@/types/payroll'

let store: PayrollRecord[] = rawData as PayrollRecord[]
let nextId = store.length + 1

export async function getPayrollRecords(month?: number, year?: number): Promise<PayrollRecord[]> {
  await mockDelay()
  if (month !== undefined && year !== undefined) {
    return store.filter((r) => r.month === month && r.year === year)
  }
  return [...store]
}

export async function getPayslip(id: string): Promise<PayrollRecord | null> {
  await mockDelay(100, 200)
  return store.find((r) => r.id === id) ?? null
}

export async function runPayroll(input: PayrollRunInput): Promise<PayrollRecord[]> {
  await mockDelay(600, 900)

  const existing = store.filter(
    (r) => r.month === input.month && r.year === input.year,
  )
  if (existing.length > 0) {
    // Mark all pending as processed
    const updated = store.map((r) =>
      r.month === input.month && r.year === input.year && r.status === 'pending'
        ? { ...r, status: 'processed' as const, processedAt: new Date().toISOString() }
        : r,
    )
    store = updated
    return store.filter((r) => r.month === input.month && r.year === input.year)
  }

  // Generate new records for all active employees
  const employees = await getEmployees()
  const now = new Date().toISOString()
  const newRecords: PayrollRecord[] = employees
    .filter((e) => e.status !== 'inactive')
    .map((e) => {
      const basic = e.salary
      const housing = Math.round(basic * 0.25)
      const transport = 1500
      const deductions = Math.round(basic * 0.10)
      const gross = basic + housing + transport
      const net = gross - deductions
      const rec: PayrollRecord = {
        id: `PAY-${String(nextId++).padStart(4, '0')}`,
        employeeId: e.id,
        month: input.month,
        year: input.year,
        basicSalary: basic,
        housing,
        transport,
        deductions,
        grossPay: gross,
        netPay: net,
        status: 'processed',
        processedAt: now,
      }
      return rec
    })

  store = [...store, ...newRecords]
  return newRecords
}
