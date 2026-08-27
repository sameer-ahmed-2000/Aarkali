'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AdminLayoutWrapper({ children, user }: { children: React.ReactNode, user: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="admin-dashboard flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Topbar user={user} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
