import { create } from 'zustand'
import * as api from '@/api/employees'
import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from '@/types/employee'

interface EmployeeState {
  employees: Employee[]
  loading: boolean
  error: string | null
  fetchEmployees: () => Promise<void>
  createEmployee: (input: CreateEmployeeInput) => Promise<Employee>
  updateEmployee: (id: string, input: UpdateEmployeeInput) => Promise<Employee>
  deleteEmployee: (id: string) => Promise<void>
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,
  error: null,
  fetchEmployees: async () => {
    set({ loading: true, error: null })
    try {
      const employees = await api.getEmployees()
      set({ employees, loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load employees' })
    }
  },
  createEmployee: async (input) => {
    const employee = await api.createEmployee(input)
    set((s) => ({ employees: [...s.employees, employee] }))
    return employee
  },
  updateEmployee: async (id, input) => {
    const updated = await api.updateEmployee(id, input)
    set((s) => ({
      employees: s.employees.map((e) => (e.id === id ? updated : e)),
    }))
    return updated
  },
  deleteEmployee: async (id) => {
    await api.deleteEmployee(id)
    set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }))
  },
}))
