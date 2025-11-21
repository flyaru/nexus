import React from 'react'
import { Moon, SunMedium, Building, Languages } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

export const Topbar: React.FC = () => {
  const { mode, setMode, language, setLanguage } = useTheme()
  const { user, logout } = useAuth()

  const cycleTheme = () => {
    const order = ['light', 'dark', 'corporate-blue'] as const
    const next = order[(order.indexOf(mode as (typeof order)[number]) + 1) % order.length]
    setMode(next)
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-10">
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Nexus Travel ERP</p>
        <h2 className="text-lg font-semibold">Operational Control Center</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-[var(--border)] p-2 hover:bg-[var(--border)]"
          onClick={cycleTheme}
        >
          {mode === 'dark' ? <Moon size={16} /> : <SunMedium size={16} />}
        </button>
        <button
          type="button"
          className="rounded-full border border-[var(--border)] p-2 hover:bg-[var(--border)]"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        >
          <Languages size={16} />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-[var(--border)] px-3 py-1">
          <Building size={16} className="text-[var(--accent)]" />
          <div className="text-xs leading-tight">
            <p className="font-semibold">{user?.name ?? 'Guest'}</p>
            <p className="text-[var(--muted)]">{user?.role ?? 'Visitor'}</p>
          </div>
        </div>
        {user && (
          <button
            type="button"
            className="text-xs px-3 py-2 rounded-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
