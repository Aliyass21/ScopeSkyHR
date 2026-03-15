import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Bell, Globe, LogOut, Palette } from 'lucide-react'
import type { AppTheme } from '@/store/uiStore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUiStore } from '@/store/uiStore'

export const Header: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language, setLanguage, theme, setTheme, logout } = useUiStore()

  const themes: { value: AppTheme; labelAr: string; labelEn: string; dot: string }[] = [
    { value: 'default',     labelAr: 'فاتح',        labelEn: 'Light',       dot: 'bg-indigo-500' },
    { value: 'dark',        labelAr: 'داكن',        labelEn: 'Dark',        dot: 'bg-slate-700' },
    { value: 'light-green', labelAr: 'أخضر فاتح',  labelEn: 'Light Green', dot: 'bg-emerald-500' },
    { value: 'dark-green',  labelAr: 'أخضر داكن',  labelEn: 'Dark Green',  dot: 'bg-emerald-800' },
  ]

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('settings.language')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setLanguage('ar')}
              className={language === 'ar' ? 'bg-accent' : ''}
            >
              🇸🇦 {t('settings.arabic')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-accent' : ''}
            >
              🇬🇧 {t('settings.english')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Theme">
              <Palette size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{language === 'ar' ? 'المظهر' : 'Theme'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {themes.map((t) => (
              <DropdownMenuItem
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={theme === t.value ? 'bg-accent' : ''}
              >
                <span className={`me-2 inline-block h-3 w-3 rounded-full ${t.dot}`} />
                {language === 'ar' ? t.labelAr : t.labelEn}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 end-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback>HR</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:block">
                {language === 'ar' ? 'سارة العتيبي' : 'Sara Al-Otaibi'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {language === 'ar' ? 'مدير الموارد البشرية' : 'HR Manager'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('nav.settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
            >
              <LogOut size={14} className="me-2" />
              {t('login.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
