import { create } from 'zustand'
import { getUsersApi, deleteUserApi } from '@/api/users'
import type { UserDto } from '@/types/api'
import type { Employee } from '@/types/employee'

function mapUserToEmployee(user: UserDto): Employee {
  return {
    id: user.id,
    nameAr: user.userName,
    nameEn: user.userName,
    email: user.email,
    phone: user.phoneNumber ?? '',
    department: 'hr',
    position: user.roles[0] ?? '',
    positionAr: user.roles[0] ?? '',
    status: user.isActive ? 'active' : 'inactive',
    hireDate: '',
    salary: 0,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.userName)}`,
  }
}

interface EmployeeState {
  employees: Employee[]
  loading: boolean
  error: string | null
  fetchEmployees: () => Promise<void>
  addEmployee: (employee: Employee) => void
  deleteEmployee: (id: string) => Promise<void>
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  loading: false,
  error: null,
  fetchEmployees: async () => {
    set({ loading: true, error: null })
    try {
      const { users } = await getUsersApi({ pageSize: 100 })
      set({ employees: users.map(mapUserToEmployee), loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load employees' })
    }
  },
  addEmployee: (employee) => {
    set((s) => ({ employees: [employee, ...s.employees] }))
  },
  deleteEmployee: async (id) => {
    await deleteUserApi(id)
    set((s) => ({ employees: s.employees.filter((e) => e.id !== id) }))
  },
}))
