import { cn } from '@/lib/utils'

interface PageWrapperProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  description,
  action,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-6 p-6', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  )
}
