import React, { useState } from 'react'
import { useData } from '../contexts/DataContext'
import { toast } from 'react-hot-toast'

export const SuppliersPage: React.FC = () => {
  const { data, recordSupplierPayment } = useData()
  const [modal, setModal] = useState<{ id: string; amount: number } | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modal) return
    recordSupplierPayment(modal.id, modal.amount)
    toast.success('Payment recorded')
    setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="card-surface rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-3">Suppliers</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                <th className="py-2">Name</th>
                <th className="py-2">Contact</th>
                <th className="py-2">Outstanding</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.suppliers.map((sup) => (
                <tr key={sup.id} className="border-b border-[var(--border)]">
                  <td className="py-3 font-semibold">{sup.name}</td>
                  <td className="py-3 text-[var(--muted)]">{sup.contact}</td>
                  <td className="py-3">{sup.currency} {sup.outstanding.toLocaleString()}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => setModal({ id: sup.id, amount: sup.outstanding })}
                      className="rounded-lg bg-[var(--accent)] text-white px-3 py-1 text-xs"
                    >
                      Quick Pay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="card-surface rounded-2xl p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-2">Record Payment</h4>
            <form className="space-y-3" onSubmit={submit}>
              <input
                type="number"
                required
                value={modal.amount}
                onChange={(e) => setModal({ ...modal, amount: Number(e.target.value) })}
                className="w-full rounded-lg px-3 py-2"
              />
              <div className="flex gap-2 justify-end">
                <button type="button" className="px-3 py-2" onClick={() => setModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
