import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { InvoiceStatus } from '../types'
import { toast } from 'react-hot-toast'

export const InvoicesPage: React.FC = () => {
  const { data, addInvoice, updateInvoiceStatus } = useData()
  const [form, setForm] = useState({
    clientName: 'Al Noor Travel',
    clientEmail: 'client@company.com',
    amount: 2500,
    currency: 'SAR',
    status: 'Issued' as InvoiceStatus,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    titleEn: 'Package Invoice',
    titleAr: 'فاتورة حزمة سفر',
    notes: 'Inclusive of hotel + transfers',
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    addInvoice(form)
    toast.success('Invoice created')
  }

  const generatePdf = (id: string) => {
    toast.success(`PDF generated for ${id}`)
  }

  return (
    <div className="space-y-4">
      <div className="card-surface rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-3">Create Invoice</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={submit}>
          <input
            required
            placeholder="Client name"
            value={form.clientName}
            onChange={(e) => setForm({ ...form, clientName: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            required
            placeholder="Client email"
            value={form.clientEmail}
            onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            required
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
            className="rounded-lg px-3 py-2"
          />
          <input
            required
            placeholder="Currency"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            placeholder="English title"
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            placeholder="Arabic title"
            value={form.titleAr}
            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            className="md:col-span-3 rounded-lg bg-[var(--accent)] text-white py-2 hover:bg-[var(--accent-strong)]"
          >
            Add Invoice
          </button>
        </form>
      </div>

      <div className="card-surface rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Invoices (EN / AR)</h3>
          <p className="text-xs text-[var(--muted)]">ZATCA style preview</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2">Client</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
                <th className="py-2">English</th>
                <th className="py-2">Arabic</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[var(--border)]">
                  <td className="py-3">
                    <p className="font-semibold">{inv.clientName}</p>
                    <p className="text-xs text-[var(--muted)]">{inv.clientEmail}</p>
                  </td>
                  <td className="py-3">{inv.currency} {inv.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <select
                      value={inv.status}
                      onChange={(e) => updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus)}
                      className="rounded-lg px-2 py-1"
                    >
                      <option value="Issued">Issued</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>
                  <td className="py-3">{inv.titleEn}</td>
                  <td className="py-3 text-right" dir="rtl">{inv.titleAr}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-[var(--accent)]"
                      onClick={() => generatePdf(inv.id)}
                    >
                      <Download size={14} /> Generate PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
