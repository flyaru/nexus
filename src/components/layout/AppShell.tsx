import React from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)]">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Topbar />
      <main className="p-6 bg-[var(--bg)] flex-1">{children}</main>
    </div>
  </div>
)
