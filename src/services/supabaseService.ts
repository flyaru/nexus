import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { BankTransaction, Booking, CashHandover, DataStore, DailySalesReport, Invoice, Role, Supplier, Task, UploadRecord, User } from '../types'
import type { DataService } from './dataService'

const tableMap = {
  users: 'users',
  invoices: 'invoices',
  suppliers: 'suppliers',
  tasks: 'tasks',
  bookings: 'bookings',
  dsrReports: 'daily_sales_reports',
  bankTransactions: 'bank_transactions',
  cashHandovers: 'cash_handovers',
  uploads: 'uploads',
}

export class SupabaseService implements DataService {
  private client: SupabaseClient

  constructor(url: string, key: string) {
    this.client = createClient(url, key)
  }

  async init(): Promise<DataStore> {
    const [users, invoices, suppliers, tasks, bookings, dsrReports, bankTransactions, cashHandovers, uploads] = await Promise.all([
      this.fetch<User>(tableMap.users),
      this.fetch<Invoice>(tableMap.invoices),
      this.fetch<Supplier>(tableMap.suppliers),
      this.fetch<Task>(tableMap.tasks),
      this.fetch<Booking>(tableMap.bookings),
      this.fetch<DailySalesReport>(tableMap.dsrReports),
      this.fetch<BankTransaction>(tableMap.bankTransactions),
      this.fetch<CashHandover>(tableMap.cashHandovers),
      this.fetch<UploadRecord>(tableMap.uploads),
    ])

    return {
      users,
      invoices,
      suppliers,
      tasks,
      bookings,
      dsrReports,
      bankTransactions,
      cashHandovers,
      uploads,
    }
  }

  private async fetch<T>(table: string): Promise<T[]> {
    const { data, error } = await this.client.from(table).select('*')
    if (error) throw error
    return data as T[]
  }

  async save(store: DataStore): Promise<void> {
    await this.client.from(tableMap.users).upsert(store.users)
    await this.client.from(tableMap.invoices).upsert(store.invoices)
    await this.client.from(tableMap.suppliers).upsert(store.suppliers)
    await this.client.from(tableMap.tasks).upsert(store.tasks)
    await this.client.from(tableMap.bookings).upsert(store.bookings)
    await this.client.from(tableMap.dsrReports).upsert(store.dsrReports)
    await this.client.from(tableMap.bankTransactions).upsert(store.bankTransactions)
    await this.client.from(tableMap.cashHandovers).upsert(store.cashHandovers)
    await this.client.from(tableMap.uploads).upsert(store.uploads)
  }

  async authenticate(email: string, password: string, scope: Role): Promise<User | null> {
    const allowed = scope === 'client' ? ['client'] : ['admin', 'agent']
    const { data, error } = await this.client
      .from(tableMap.users)
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .in('role', allowed)
      .single()
    if (error) return null
    return data ?? null
  }
}
