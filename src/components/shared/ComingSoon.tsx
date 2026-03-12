import { useTranslation } from 'react-i18next'
import { Construction } from 'lucide-react'

interface ComingSoonProps {
  moduleName: string
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ moduleName }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Construction size={36} className="text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">{moduleName}</h2>
      <p className="text-muted-foreground max-w-sm">{t('common.comingSoonDesc')}</p>
      <div className="mt-6 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
