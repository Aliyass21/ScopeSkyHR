import { useTranslation } from 'react-i18next'
import { Mail, Phone, Calendar, DollarSign, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useUiStore } from '@/store/uiStore'
import type { Employee } from '@/types/employee'

interface EmployeeProfileProps {
  employee: Employee
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  onleave: 'warning',
  inactive: 'destructive',
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={employee.avatarUrl} />
              <AvatarFallback className="text-2xl">{employee.nameEn.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-start space-y-1">
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? employee.nameAr : employee.nameEn}
              </h2>
              <p className="text-muted-foreground">
                {language === 'ar' ? employee.positionAr : employee.position}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant={statusVariant[employee.status]}>
                  {t(`employees.form.status.${employee.status}`)}
                </Badge>
                <span className="text-xs text-muted-foreground">{employee.id}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('employees.profile.personalInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-muted-foreground shrink-0" />
              <span>{employee.email}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <span>{employee.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('employees.profile.employmentInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Building2 size={16} className="text-muted-foreground shrink-0" />
              <span>{t(`employees.form.departments.${employee.department}`)}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-muted-foreground shrink-0" />
              <span>{new Date(employee.hireDate).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <DollarSign size={16} className="text-muted-foreground shrink-0" />
              <span>{employee.salary.toLocaleString()} SAR</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
