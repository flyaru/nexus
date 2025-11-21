import React, { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { reconcileWithGemini, ReconciliationMatch } from '../services/geminiService'
import { toast } from 'react-hot-toast'

export const ReconciliationPage: React.FC = () => {
  const { data, applyReconciliation } = useData()
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState<ReconciliationMatch[]>([])

  const handleAuto = async () => {
    if (!data) return
    setLoading(true)
    const response = await reconcileWithGemini(data.bankTransactions, data.dsrReports)
    setMatches(response.matches)
    applyReconciliation(response.matches)
    toast.success(response.message)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Reconciliation</h3>
        <button
          type="button"
          onClick={handleAuto}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-strong)]"
        >
          <Wand2 size={16} /> {loading ? 'Reconciling...' : 'Auto-Reconcile with Gemini'}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-surface rounded-2xl p-4">
          <h4 className="font-semibold mb-2">Daily Sales Reports</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data?.dsrReports.map((r) => (
              <div key={r.id} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2">
                <div>
                  <p className="font-semibold">{r.reference}</p>
                  <p className="text-xs text-[var(--muted)]">{r.date}</p>
                </div>
                <p className="text-sm">SAR {r.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card-surface rounded-2xl p-4">
          <h4 className="font-semibold mb-2">Bank Transactions</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data?.bankTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2">
                <div>
                  <p className="font-semibold">{tx.reference}</p>
                  <p className="text-xs text-[var(--muted)]">{tx.date}</p>
                  {tx.matchedReportId && <p className="text-xs text-green-600">Matched: {tx.matchedReportId}</p>}
                </div>
                <p className="text-sm">SAR {tx.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="card-surface rounded-2xl p-4">
          <h4 className="font-semibold mb-2">Gemini Suggestions</h4>
          <div className="space-y-2">
            {matches.map((m) => (
              <div key={m.transactionId} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-3 py-2">
                <div>
                  <p className="font-semibold">Txn {m.transactionId}</p>
                  <p className="text-xs text-[var(--muted)]">Reason: {m.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">Report: {m.reportId ?? 'None'}</p>
                  <p className="text-xs text-[var(--muted)]">Confidence {(m.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
