import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useUiStore } from '@/store/uiStore'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language, setLanguage, login, isAuthenticated } = useUiStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError(t('login.fillAllFields'))
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1100))

    if (email === 'admin@corehr.com' && password === 'CoreHR2026') {
      login()
      toast.success(t('login.welcomeBack'))
      navigate('/', { replace: true })
    } else {
      setError(t('login.invalidCredentials'))
    }
    setLoading(false)
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#050714]">
      {/* ── Animated gradient blobs ── */}
      <div className="animate-blob-full absolute -start-32 -top-32 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[80px]" />
      <div className="animate-blob-full animation-delay-2000 absolute -bottom-32 -end-32 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[80px]" />
      <div className="animate-blob-full animation-delay-4000 absolute bottom-1/3 start-1/4 h-72 w-72 rounded-full bg-violet-600/15 blur-[60px]" />
      <div className="animate-blob-full animation-delay-2000 absolute end-1/4 top-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-[60px]" />

      {/* ── Grid overlay ── */}
      <div className="bg-login-grid pointer-events-none absolute inset-0" />

      {/* ── Radial vignette so edges stay dark ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, #050714 100%)',
        }}
      />

      {/* ── Radar rings ── */}
      <div className="radar-ring radar-ring-1" />
      <div className="radar-ring radar-ring-2" />
      <div className="radar-ring radar-ring-3" />

      {/* ── Floating particles ── */}
      <div className="particle" style={{ width:'5px', height:'5px', top:'15%', left:'8%',  animationDuration:'7s',   animationDelay:'0s'    }} />
      <div className="particle" style={{ width:'4px', height:'4px', top:'70%', left:'12%', animationDuration:'9s',   animationDelay:'-2.5s' }} />
      <div className="particle" style={{ width:'6px', height:'6px', top:'35%', left:'5%',  animationDuration:'6s',   animationDelay:'-4s'   }} />
      <div className="particle" style={{ width:'4px', height:'4px', top:'80%', left:'88%', animationDuration:'11s',  animationDelay:'-1s'   }} />
      <div className="particle" style={{ width:'5px', height:'5px', top:'20%', left:'92%', animationDuration:'8s',   animationDelay:'-6s'   }} />
      <div className="particle" style={{ width:'3px', height:'3px', top:'55%', left:'95%', animationDuration:'10s',  animationDelay:'-3s'   }} />
      <div className="particle" style={{ width:'6px', height:'6px', top:'88%', left:'40%', animationDuration:'7.5s', animationDelay:'-5s'   }} />
      <div className="particle" style={{ width:'4px', height:'4px', top:'10%', left:'60%', animationDuration:'12s',  animationDelay:'-8s'   }} />

      {/* ── Diagonal light streak ── */}
      <div className="light-streak" />

      {/* ── Language toggle ── */}
      <div className="absolute end-6 top-6 z-20">
        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      {/* ── Center card ── */}
      <div className="relative z-10 m-auto flex w-full max-w-md flex-col px-4 py-12">
        {/* Glass card */}
        <div
          className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-10 backdrop-blur-2xl"
          style={{
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(79,70,229,0.12)',
          }}
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
              style={{
                background:
                  'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
                boxShadow:
                  '0 8px 32px rgba(79,70,229,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              >
                <path
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {t('app.name')}
              </h1>
              <p className="mt-0.5 text-sm text-white/40">{t('app.tagline')}</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">{t('login.title')}</h2>
            <p className="mt-1 text-sm text-white/40">{t('login.subtitle')}</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 fill-current">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/50">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@corehr.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/50 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-white/50">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pe-12 text-sm text-white placeholder-white/20 outline-none transition focus:border-indigo-500/50 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/25"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{
                background: loading
                  ? 'rgba(79,70,229,0.5)'
                  : 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                boxShadow: loading
                  ? 'none'
                  : '0 4px 24px rgba(79,70,229,0.45)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 0 1 8-8v4l3-3-3-3v4a8 8 0 0 1 8 8h-4l3 3 3-3h-4a8 8 0 0 1-8 8v-4l-3 3 3 3v-4a8 8 0 0 1-8-8H4Z" />
                  </svg>
                  {t('login.signingIn')}
                </span>
              ) : (
                t('login.signIn')
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/30">
              {t('login.demoCredentials')}
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-white/30">{t('login.email')}</span>
                <code className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
                  admin@corehr.com
                </code>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-white/30">{t('login.password')}</span>
                <code className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-white/60">
                  CoreHR2026
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/20">
          © 2026 CoreHR · {t('login.allRightsReserved')}
        </p>
      </div>
    </div>
  )
}
