import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Banknote,
  Briefcase,
  Network,
  Settings,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUiStore } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTokenClaims, useIsAdmin } from '@/hooks/usePermission'
import { PERMISSIONS } from '@/utils/permissions'

interface NavItem {
  key: string
  path: string
  icon: React.ReactNode
  /** Permission code required to see this item (admin always sees all). */
  permission?: string
}

const navItems: NavItem[] = [
  { key: 'nav.dashboard',   path: '/',            icon: <LayoutDashboard size={20} /> },
  { key: 'nav.employees',   path: '/employees',   icon: <Users size={20} />,        permission: PERMISSIONS.VIEW_EMPLOYEE },
  { key: 'nav.attendance',  path: '/attendance',  icon: <Clock size={20} />,        permission: PERMISSIONS.VIEW_ATTENDANCE },
  { key: 'nav.leave',       path: '/leave',       icon: <CalendarDays size={20} />, permission: PERMISSIONS.VIEW_LEAVE_REQUESTS },
  { key: 'nav.payroll',     path: '/payroll',     icon: <Banknote size={20} /> },
  { key: 'nav.recruitment', path: '/recruitment', icon: <Briefcase size={20} /> },
  { key: 'nav.orgchart',    path: '/orgchart',    icon: <Network size={20} />,      permission: PERMISSIONS.VIEW_LOCATION },
  { key: 'nav.settings',    path: '/settings',    icon: <Settings size={20} />,     permission: PERMISSIONS.VIEW_SYSTEM_CONFIG },
]

export const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const { sidebarCollapsed, toggleSidebar, language } = useUiStore()
  const location = useLocation()
  const isAdmin = useIsAdmin()
  const { permissions } = useTokenClaims()

  const visibleItems = navItems.filter(
    (item) => !item.permission || isAdmin || permissions.includes(item.permission)
  )
  const isRtl = language === 'ar'
  const CollapseIcon = isRtl
    ? sidebarCollapsed ? ChevronLeft : ChevronRight
    : sidebarCollapsed ? ChevronRight : ChevronLeft

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-e bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              HR
            </div>
            <span className="font-bold text-lg text-primary">{t('app.name')}</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            HR
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {visibleItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.key} delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'flex h-10 w-full items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {item.icon}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side={isRtl ? 'left' : 'right'}>
                  {t(item.key)}
                </TooltipContent>
              </Tooltip>
            )
          }

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={cn(
                'flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {item.icon}
              <span>{t(item.key)}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Toggle button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <CollapseIcon size={16} />
        </Button>
      </div>
    </aside>
  )
}
