import { DataStore, Role, User } from '../types'
import type { DataService } from './dataService'

const storageKey = 'nexus-pro-data'
const inMemoryStore: { value?: DataStore } = {}
const clone = <T,>(value: T): T => (typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value)))

const seedData = (): DataStore => {
  const today = new Date()
  const formatDate = (d: Date) => d.toISOString().split('T')[0]
  const dsr: DataStore = {
    users: [
      { id: '1', name: 'Admin', email: 'admin@nexus.pro', password: 'demo123', role: 'admin' },
      { id: '2', name: 'Agent', email: 'agent@nexus.pro', password: 'demo123', role: 'agent' },
      { id: '3', name: 'Client', email: 'client@company.com', password: 'client123', role: 'client' },
    ],
    suppliers: [
      { id: 's1', name: 'Saudi Airlines', contact: '+966 1111 2222', outstanding: 12000, currency: 'SAR' },
      { id: 's2', name: 'Emirates', contact: '+971 4444 9999', outstanding: 18000, currency: 'AED' },
      { id: 's3', name: 'Hilton Makkah', contact: '+966 3456 7890', outstanding: 9500, currency: 'SAR' },
      { id: 's4', name: 'Hyatt Riyadh', contact: '+966 5555 1212', outstanding: 7200, currency: 'SAR' },
      { id: 's5', name: 'Etihad Airways', contact: '+971 8888 7777', outstanding: 11200, currency: 'AED' },
    ],
    invoices: [],
    tasks: [
      { id: 't1', title: 'Issue tickets for Hajj group', status: 'todo', owner: 'Admin' },
      { id: 't2', title: 'Collect passports from client', status: 'in-progress', owner: 'Agent' },
      { id: 't3', title: 'Send supplier payments', status: 'done', owner: 'Admin' },
    ],
    bookings: [
      { id: 'b1', name: 'Hajj 2025 Group A', travelers: 45, departure: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 20)), returnDate: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 35)), leadAgent: 'Admin' },
      { id: 'b2', name: 'Umrah Ramadan Deluxe', travelers: 25, departure: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 60)), returnDate: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 72)), leadAgent: 'Agent' },
      { id: 'b3', name: 'Corporate Summit Dubai', travelers: 60, departure: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 10)), returnDate: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * 15)), leadAgent: 'Admin' },
    ],
    dsrReports: [],
    bankTransactions: [],
    cashHandovers: [],
    uploads: [],
  }

  const invoiceStatuses: ('Paid' | 'Issued' | 'Overdue')[] = ['Paid', 'Issued', 'Overdue']
  for (let i = 0; i < 10; i += 1) {
    dsr.invoices.push({
      id: `inv-${i + 1}`,
      clientName: i % 2 === 0 ? 'Al Noor Travel' : 'Client Co',
      clientEmail: i % 2 === 0 ? 'client@company.com' : 'billing@travel.com',
      amount: 2500 + i * 500,
      currency: 'SAR',
      status: invoiceStatuses[i % invoiceStatuses.length],
      issueDate: formatDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * (20 - i))),
      dueDate: formatDate(new Date(today.getTime() + 1000 * 60 * 60 * 24 * (i + 2))),
      titleEn: `Invoice #${i + 1}`,
      titleAr: `فاتورة رقم ${i + 1}`,
      notes: 'Inclusive of hotel + airfare',
    })
  }

  for (let i = 0; i < 55; i += 1) {
    dsr.dsrReports.push({
      id: `dsr-${i + 1}`,
      reference: `DSR-${1000 + i}`,
      date: formatDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * i)),
      amount: 1500 + (i % 5) * 200,
    })
  }

  for (let i = 0; i < 40; i += 1) {
    const reference = i % 3 === 0 ? `DSR-${1000 + i}` : `BANK-${800 + i}`
    dsr.bankTransactions.push({
      id: `txn-${i + 1}`,
      reference,
      date: formatDate(new Date(today.getTime() - 1000 * 60 * 60 * 24 * (i % 12))),
      amount: 1500 + (i % 5) * 200 + (i % 3 === 0 ? 0 : 75),
    })
  }

  return dsr
}

const readStore = (): DataStore => {
  if (typeof localStorage === 'undefined') {
    if (!inMemoryStore.value) inMemoryStore.value = seedData()
    return clone(inMemoryStore.value)
  }
  const raw = localStorage.getItem(storageKey)
  if (!raw) {
    const seeded = seedData()
    localStorage.setItem(storageKey, JSON.stringify(seeded))
    return seeded
  }
  return JSON.parse(raw) as DataStore
}

export class MockDataService implements DataService {
  private store: DataStore

  constructor() {
    this.store = readStore()
  }

  async init(): Promise<DataStore> {
    this.store = readStore()
    return clone(this.store)
  }

  async save(store: DataStore): Promise<void> {
    this.store = clone(store)
    if (typeof localStorage === 'undefined') {
      inMemoryStore.value = this.store
      return
    }
    localStorage.setItem(storageKey, JSON.stringify(this.store))
  }

  async authenticate(email: string, password: string, scope: Role): Promise<User | null> {
    const allowedRoles = scope === 'client' ? ['client'] : ['admin', 'agent']
    const user = this.store.users.find((u) => u.email === email && u.password === password && allowedRoles.includes(u.role))
    return user ? clone(user) : null
  }
}
