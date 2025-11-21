import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const ClientPortalPage: React.FC = () => {
  const { user } = useAuth()
  const { data, addUpload } = useData()
  const [uploading, setUploading] = useState(false)

  const invoices = data?.invoices.filter((inv) => inv.clientEmail === user?.email) ?? []

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setTimeout(() => {
      addUpload(file.name)
      toast.success('File uploaded')
      setUploading(false)
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div className="card-surface rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-2">Your Invoices</h3>
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2">
              <div>
                <p className="font-semibold">{inv.titleEn}</p>
                <p className="text-xs text-[var(--muted)]" dir="rtl">{inv.titleAr}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{inv.currency} {inv.amount.toLocaleString()}</p>
                <p className="text-xs text-[var(--muted)]">{inv.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-3">Upload Documents</h3>
        <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-[var(--border)] rounded-xl cursor-pointer">
          <Upload size={16} className="text-[var(--accent)]" />
          <span>{uploading ? 'Uploading...' : 'Click to upload passport/visa'}</span>
          <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <div className="space-y-2 mt-3">
          {data?.uploads.map((u) => (
            <div key={u.id} className="border border-[var(--border)] rounded-lg px-3 py-2">
              <div className="flex items-center justify-between text-sm">
                <p>{u.fileName}</p>
                <p className="text-[var(--muted)]">{u.progress}%</p>
              </div>
              <div className="w-full bg-[var(--border)] h-2 rounded-full mt-1">
                <div className="h-2 bg-[var(--accent)] rounded-full" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
