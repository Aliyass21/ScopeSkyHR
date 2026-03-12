import { useTranslation } from 'react-i18next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ComingSoon } from '@/components/shared/ComingSoon'

export default function SettingsPage() {
  const { t } = useTranslation()
  return (
    <PageWrapper title={t('settings.title')}>
      <ComingSoon moduleName={t('settings.comingSoon')} />
    </PageWrapper>
  )
}
