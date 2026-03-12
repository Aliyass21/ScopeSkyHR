import type { DepartmentId, EmployeeStatus } from './common'

export interface Employee {
  id: string
  nameAr: string
  nameEn: string
  email: string
  phone: string
  department: DepartmentId
  position: string
  positionAr: string
  status: EmployeeStatus
  hireDate: string
  salary: number
  avatarUrl?: string
  faceDescriptor?: number[]
  managerId?: string
}

export interface CreateEmployeeInput {
  nameAr: string
  nameEn: string
  email: string
  phone: string
  department: DepartmentId
  position: string
  positionAr: string
  status: EmployeeStatus
  hireDate: string
  salary: number
  managerId?: string
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>
