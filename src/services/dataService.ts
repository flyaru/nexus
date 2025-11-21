import { DataStore, Role, User } from '../types'

export interface DataService {
  init(): Promise<DataStore>
  save(store: DataStore): Promise<void>
  authenticate(email: string, password: string, scope: Role): Promise<User | null>
}
