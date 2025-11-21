import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { toast } from 'react-hot-toast'

export const ClientLoginPage: React.FC = () => {
  const { login } = useAuth()
  const { language } = useTheme()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'client@company.com', password: 'client123' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await login(form.email, form.password, 'client')
    if (ok) {
      toast.success('Client authenticated')
      navigate('/client-portal')
    } else {
      toast.error('Invalid client login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="card-surface w-full max-w-md rounded-2xl p-8 shadow-card">
        <h1 className="text-2xl font-semibold mb-2">Client Portal</h1>
        <p className="text-sm text-[var(--muted)] mb-6">Access your invoices & documents</p>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="text-sm text-[var(--muted)]">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)]">Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--accent)] text-white py-2 font-semibold hover:bg-[var(--accent-strong)]"
          >
            Sign in
          </button>
          <p className="text-xs text-[var(--muted)]">Demo: client@company.com / client123</p>
        </form>
      </div>
    </div>
  )
}
