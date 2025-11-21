import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bot, Building2, FileText, LayoutDashboard, ListTodo, LogIn, PanelsTopLeft, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import clsx from 'classnames'

const links = [
  { to: '/', labelKey: 'dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/invoices', labelKey: 'invoices', icon: <FileText size={18} /> },
  { to: '/suppliers', labelKey: 'suppliers', icon: <Building2 size={18} /> },
  { to: '/tasks', labelKey: 'tasks', icon: <ListTodo size={18} /> },
  { to: '/reconciliation', labelKey: 'reconciliation', icon: <Bot size={18} /> },
  { to: '/client-portal', labelKey: 'clientPortal', icon: <Wallet size={18} /> },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx('card-surface h-screen sticky top-0 flex flex-col transition-all duration-300', collapsed ? 'w-20' : 'w-64')}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <PanelsTopLeft className="text-[var(--accent)]" />
          {!collapsed && <span>NEXUS PRO</span>}
        </div>
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-full border border-[var(--border)] p-1 text-[var(--muted)] hover:text-[var(--accent)]"
        >
          <LogIn size={14} className={clsx(collapsed && 'rotate-180')} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--text)]',
              )}
            >
              {link.icon}
              {!collapsed && <span>{t(link.labelKey)}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
