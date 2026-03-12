import type { Employee } from '@/types/employee'
import type { OrgNodeData } from '@/types/orgchart'

function getInitials(nameEn: string): string {
  return nameEn
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function buildOrgTree(employees: Employee[]): OrgNodeData {
  const nodeMap = new Map<string, OrgNodeData>()

  for (const emp of employees) {
    nodeMap.set(emp.id, {
      id: emp.id,
      type: 'employee',
      label: emp.nameEn,
      labelAr: emp.nameAr,
      subtitle: emp.position,
      subtitleAr: emp.positionAr,
      department: emp.department,
      status: emp.status,
      avatarInitials: getInitials(emp.nameEn),
      employee: emp,
      children: [],
    })
  }

  const roots: OrgNodeData[] = []

  for (const emp of employees) {
    const node = nodeMap.get(emp.id)!
    if (emp.managerId && nodeMap.has(emp.managerId)) {
      nodeMap.get(emp.managerId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return {
    id: 'root',
    type: 'root',
    label: 'CoreHR',
    labelAr: 'كور HR',
    subtitle: 'Company',
    subtitleAr: 'الشركة',
    avatarInitials: 'CR',
    children: roots,
  }
}
