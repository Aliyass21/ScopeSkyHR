import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import DashboardPage from '@/pages/DashboardPage'
import EmployeesPage from '@/pages/EmployeesPage'
import EmployeeDetailPage from '@/pages/EmployeeDetailPage'
import AttendancePage from '@/pages/AttendancePage'
import LeavePage from '@/pages/LeavePage'
import PayrollPage from '@/pages/PayrollPage'
import RecruitmentPage from '@/pages/RecruitmentPage'
import OrgChartPage from '@/pages/OrgChartPage'
import SettingsPage from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'employees', element: <EmployeesPage /> },
      { path: 'employees/:id', element: <EmployeeDetailPage /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'leave', element: <LeavePage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'recruitment', element: <RecruitmentPage /> },
      { path: 'orgchart', element: <OrgChartPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
