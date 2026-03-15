import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useUiStore } from '@/store/uiStore'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import EmployeesPage from '@/pages/EmployeesPage'
import EmployeeDetailPage from '@/pages/EmployeeDetailPage'
import AttendancePage from '@/pages/AttendancePage'
import LeavePage from '@/pages/LeavePage'
import PayrollPage from '@/pages/PayrollPage'
import RecruitmentPage from '@/pages/RecruitmentPage'
import OrgChartPage from '@/pages/OrgChartPage'
import SettingsPage from '@/pages/SettingsPage'

function ProtectedRoute() {
  const isAuthenticated = useUiStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <AppShell />
  )
}


export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
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
