import { DataService } from './dataService'
import { MockDataService } from './mockDataService'
import { SupabaseService } from './supabaseService'

let cachedService: DataService | null = null

export const getDataService = (): DataService => {
  if (cachedService) return cachedService
  const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true'
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

  if (useSupabase && supabaseUrl && supabaseKey) {
    cachedService = new SupabaseService(supabaseUrl, supabaseKey)
  } else {
    if (useSupabase) {
      console.warn('Supabase requested but env vars missing; falling back to mock data')
    }
    cachedService = new MockDataService()
  }
  return cachedService
}
