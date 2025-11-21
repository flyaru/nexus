import React, { createContext, useContext, useEffect, useState } from 'react'
import { Role, User } from '../types'
import { getDataService } from '../services/dataServiceFactory'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string, scope: Role) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const AUTH_KEY = 'nexus-session'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? (JSON.parse(stored) as User) : null
  })
  const service = getDataService()

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }, [user])

  const login = async (email: string, password: string, scope: Role) => {
    const authenticated = await service.authenticate(email, password, scope)
    setUser(authenticated ?? null)
    return Boolean(authenticated)
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
