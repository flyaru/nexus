import React, { createContext, useContext, useEffect, useState } from 'react'
import { BankTransaction, CashHandover, DataStore, Invoice, InvoiceStatus, Task, TaskStatus, UploadRecord } from '../types'
import { getDataService } from '../services/dataServiceFactory'

interface DataContextValue {
  data: DataStore | null
  loading: boolean
  addInvoice: (payload: Omit<Invoice, 'id'>) => void
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void
  recordSupplierPayment: (id: string, amount: number) => void
  addTask: (title: string) => void
  moveTask: (id: string, status: TaskStatus) => void
  recordCashHandover: (amount: number, note: string, recordedBy: string) => void
  addUpload: (fileName: string) => void
  applyReconciliation: (matches: { transactionId: string; reportId?: string; confidence: number; reason: string }[]) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DataStore | null>(null)
  const [loading, setLoading] = useState(true)
  const service = getDataService()

  useEffect(() => {
    service.init().then((store) => {
      setData(store)
      setLoading(false)
    })
  }, [service])

  const persist = (next: DataStore) => {
    setData(next)
    service.save(next)
  }

  const addInvoice = (payload: Omit<Invoice, 'id'>) => {
    if (!data) return
    const invoice: Invoice = { ...payload, id: `inv-${crypto.randomUUID?.() ?? Date.now()}` }
    persist({ ...data, invoices: [invoice, ...data.invoices] })
  }

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    if (!data) return
    const invoices = data.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    persist({ ...data, invoices })
  }

  const recordSupplierPayment = (id: string, amount: number) => {
    if (!data) return
    const suppliers = data.suppliers.map((sup) => (sup.id === id ? { ...sup, outstanding: Math.max(0, sup.outstanding - amount) } : sup))
    persist({ ...data, suppliers })
  }

  const addTask = (title: string) => {
    if (!data) return
    const newTask: Task = { id: `task-${crypto.randomUUID?.() ?? Date.now()}`, owner: 'Team', status: 'todo', title }
    persist({ ...data, tasks: [...data.tasks, newTask] })
  }

  const moveTask = (id: string, status: TaskStatus) => {
    if (!data) return
    const tasks = data.tasks.map((task) => (task.id === id ? { ...task, status } : task))
    persist({ ...data, tasks })
  }

  const recordCashHandover = (amount: number, note: string, recordedBy: string) => {
    if (!data) return
    const handover: CashHandover = {
      id: `cash-${crypto.randomUUID?.() ?? Date.now()}`,
      amount,
      note,
      createdAt: new Date().toISOString(),
      recordedBy,
    }
    persist({ ...data, cashHandovers: [handover, ...data.cashHandovers] })
  }

  const addUpload = (fileName: string) => {
    if (!data) return
    const upload: UploadRecord = {
      id: `upload-${crypto.randomUUID?.() ?? Date.now()}`,
      fileName,
      uploadedAt: new Date().toISOString(),
      progress: 100,
    }
    persist({ ...data, uploads: [upload, ...data.uploads] })
  }

  const applyReconciliation = (matches: { transactionId: string; reportId?: string; confidence: number; reason: string }[]) => {
    if (!data) return
    const updatedBank: BankTransaction[] = data.bankTransactions.map((tx) => {
      const match = matches.find((m) => m.transactionId === tx.id)
      return match ? { ...tx, matchedReportId: match.reportId } : tx
    })
    persist({ ...data, bankTransactions: updatedBank })
  }

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        addInvoice,
        updateInvoiceStatus,
        recordSupplierPayment,
        addTask,
        moveTask,
        recordCashHandover,
        addUpload,
        applyReconciliation,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
