import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUiStore } from '@/store/uiStore'
import type { OrgNodeData } from '@/types/orgchart'

const statusDot: Record<string, string> = {
  active: 'bg-green-500',
  inactive: 'bg-slate-400',
  onleave: 'bg-amber-400',
}

const deptColor: Record<string, string> = {
  engineering: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  hr: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  marketing: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  operations: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  sales: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  it: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  legal: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

interface OrgNodeCardProps {
  node: OrgNodeData
  selected: boolean
  onSelect: () => void
}

export const OrgNodeCard: React.FC<OrgNodeCardProps> = ({ node, selected, onSelect }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const name = language === 'ar' ? node.labelAr : node.label
  const subtitle = language === 'ar' ? (node.subtitleAr ?? node.subtitle) : node.subtitle

  if (node.type === 'root') {
    return (
      <div
        className={`
          flex flex-col items-center justify-center rounded-2xl border-2 border-primary
          bg-primary px-10 py-4 text-primary-foreground shadow-lg cursor-default select-none
          ${selected ? 'ring-4 ring-primary/30' : ''}
        `}
        onClick={onSelect}
      >
        <p className="text-base font-bold tracking-wide">{name}</p>
        <p className="text-sm opacity-75">{subtitle}</p>
      </div>
    )
  }

  return (
    <div
      className={`
        relative w-44 rounded-xl border bg-card p-3 shadow-sm cursor-pointer text-start
        hover:shadow-md transition-all select-none
        ${selected ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/40'}
      `}
      onClick={onSelect}
    >
      {node.status && (
        <span
          className={`absolute top-2.5 end-2.5 h-2 w-2 rounded-full ${statusDot[node.status] ?? 'bg-slate-400'}`}
        />
      )}

      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {node.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">{subtitle}</p>
        </div>
      </div>

      {node.department && (
        <span
          className={`inline-block text-[10px] font-medium rounded-full px-2 py-0.5 leading-tight
            ${deptColor[node.department] ?? 'bg-muted text-muted-foreground'}`}
        >
          {t(`employees.form.departments.${node.department}`)}
        </span>
      )}
    </div>
  )
}
