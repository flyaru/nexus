export type InvoiceStatus = 'Paid' | 'Issued' | 'Overdue'
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type ThemeMode = 'light' | 'dark' | 'corporate-blue'
export type Role = 'admin' | 'agent' | 'client'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
}

export interface Supplier {
  id: string
  name: string
  contact: string
  outstanding: number
  currency: string
}

export interface Invoice {
  id: string
  clientName: string
  clientEmail: string
  amount: number
  currency: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  titleEn: string
  titleAr: string
  notes?: string
}

export interface Task {
  id: string
  title: string
  status: TaskStatus
  owner: string
}

export interface Booking {
  id: string
  name: string
  travelers: number
  departure: string
  returnDate: string
  leadAgent: string
}

export interface DailySalesReport {
  id: string
  reference: string
  date: string
  amount: number
}

export interface BankTransaction {
  id: string
  reference: string
  date: string
  amount: number
  matchedReportId?: string
}

export interface CashHandover {
  id: string
  amount: number
  note: string
  createdAt: string
  recordedBy: string
}

export interface UploadRecord {
  id: string
  fileName: string
  uploadedAt: string
  progress: number
}

export interface DataStore {
  users: User[]
  invoices: Invoice[]
  suppliers: Supplier[]
  tasks: Task[]
  bookings: Booking[]
  dsrReports: DailySalesReport[]
  bankTransactions: BankTransaction[]
  cashHandovers: CashHandover[]
  uploads: UploadRecord[]
}
