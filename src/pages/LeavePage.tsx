import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { LeaveTable } from '@/components/leave/LeaveTable'
import { LeaveBalanceCard } from '@/components/leave/LeaveBalanceCard'
import { LeaveRequestForm } from '@/components/leave/LeaveRequestForm'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLeaveStore } from '@/store/leaveStore'
import { useEmployeeStore } from '@/store/employeeStore'

const CURRENT_EMPLOYEE_ID = 'EMP-0001'

export default function LeavePage() {
  const { t } = useTranslation()
  const { requests, balance, loading, fetchRequests, fetchBalance } = useLeaveStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
    fetchBalance(CURRENT_EMPLOYEE_ID)
    if (employees.length === 0) fetchEmployees()
  }, [])

  const pending = requests.filter((r) => r.status === 'pending')

  return (
    <PageWrapper
      title={t('leave.title')}
      action={
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} />
          {t('leave.requestLeave')}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          {balance ? (
            <LeaveBalanceCard balance={balance} />
          ) : (
            <LoadingSkeleton type="card" />
          )}
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">{t('common.all')}</TabsTrigger>
              <TabsTrigger value="mine">{t('leave.myLeaves')}</TabsTrigger>
              <TabsTrigger value="pending">
                {t('leave.pendingApprovals')}
                {pending.length > 0 && (
                  <span className="ms-1.5 rounded-full bg-primary text-primary-foreground text-xs px-1.5 py-0.5">
                    {pending.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {loading ? <LoadingSkeleton rows={4} /> : <LeaveTable />}
            </TabsContent>
            <TabsContent value="mine" className="mt-4">
              {loading ? <LoadingSkeleton rows={4} /> : <LeaveTable />}
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              {loading ? <LoadingSkeleton rows={4} /> : <LeaveTable />}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <LeaveRequestForm open={formOpen} onOpenChange={setFormOpen} />
    </PageWrapper>
  )
}
