import type { Employee } from './employee'

export interface OrgNodeData {
  id: string
  type: 'root' | 'employee'
  label: string
  labelAr: string
  subtitle?: string
  subtitleAr?: string
  department?: string
  status?: Employee['status']
  avatarInitials: string
  employee?: Employee
  children: OrgNodeData[]
}
