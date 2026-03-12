import { mockDelay } from '@/utils/mockDelay'
import rawData from '@/data/employees.json'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '@/types/employee'

let store: Employee[] = rawData as Employee[]
let nextId = store.length + 1

export async function getEmployees(): Promise<Employee[]> {
  await mockDelay()
  return [...store]
}

export async function getEmployee(id: string): Promise<Employee | null> {
  await mockDelay()
  return store.find((e) => e.id === id) ?? null
}

export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  await mockDelay()
  const id = `EMP-${String(nextId++).padStart(4, '0')}`
  const employee: Employee = {
    ...input,
    id,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    faceDescriptor: Array.from({ length: 16 }, () => Math.random() * 2 - 1),
  }
  store = [...store, employee]
  return employee
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
  await mockDelay()
  const idx = store.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error('Employee not found')
  const updated = { ...store[idx], ...input }
  store = store.map((e) => (e.id === id ? updated : e))
  return updated
}

export async function deleteEmployee(id: string): Promise<void> {
  await mockDelay()
  store = store.filter((e) => e.id !== id)
}
