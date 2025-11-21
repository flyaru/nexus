import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { StatCard } from '../components/common/StatCard'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export const DashboardPage: React.FC = () => {
  const { data, recordCashHandover } = useData()
  const { user } = useAuth()
  const [cashForm, setCashForm] = useState({ amount: 0, note: '' })

  const totalSales = data?.invoices.reduce((sum, inv) => sum + inv.amount, 0) ?? 0
  const outstanding = data?.suppliers.reduce((sum, sup) => sum + sup.outstanding, 0) ?? 0
  const pendingTasks = data?.tasks.filter((t) => t.status !== 'done').length ?? 0

  const handleCash = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    recordCashHandover(Number(cashForm.amount), cashForm.note, user.name)
    toast.success('Cash handover logged')
    setCashForm({ amount: 0, note: '' })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value={`SAR ${totalSales.toLocaleString()}`} hint="All invoices" />
        <StatCard title="Outstanding Invoices" value={`${(data?.invoices.filter((i) => i.status !== 'Paid').length ?? 0)}`} hint="Awaiting collection" />
        <StatCard title="Pending Tasks" value={`${pendingTasks}`} hint="Kanban board" />
        <StatCard title="Suppliers Exposure" value={`SAR ${outstanding.toLocaleString()}`} hint="Open balance" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-surface rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quick Cash Handover</h3>
            <span className="text-xs text-[var(--muted)]">For front-office agents</span>
          </div>
          <form className="mt-4 space-y-3" onSubmit={handleCash}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-[var(--muted)]">Amount (SAR)</label>
                <input
                  type="number"
                  required
                  value={cashForm.amount}
                  onChange={(e) => setCashForm({ ...cashForm, amount: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[var(--muted)]">Note</label>
                <input
                  type="text"
                  required
                  value={cashForm.note}
                  onChange={(e) => setCashForm({ ...cashForm, note: e.target.value })}
                  className="mt-1 w-full rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent)] text-white px-4 py-2 hover:bg-[var(--accent-strong)]"
            >
              Record Handover
            </button>
          </form>
          <div className="mt-5 space-y-2 max-h-48 overflow-y-auto">
            {data?.cashHandovers.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm border-b border-[var(--border)] pb-2">
                <div>
                  <p className="font-semibold">SAR {c.amount.toLocaleString()}</p>
                  <p className="text-[var(--muted)]">{c.note}</p>
                </div>
                <p className="text-[var(--muted)] text-xs">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Group Bookings</h3>
          <div className="space-y-3">
            {data?.bookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="border border-[var(--border)] rounded-xl p-4"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{booking.name}</p>
                    <p className="text-[var(--muted)] text-xs">Lead: {booking.leadAgent}</p>
                  </div>
                  <p className="text-sm font-semibold">{booking.travelers} pax</p>
                </div>
                <p className="text-xs text-[var(--muted)] mt-2">
                  {booking.departure} → {booking.returnDate}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
