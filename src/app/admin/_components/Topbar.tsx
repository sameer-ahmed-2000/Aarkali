'use client'

import React from 'react'
import { Menu, Bell, Search, ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export function Topbar({ user, onMenuToggle }: { user: any, onMenuToggle?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const isSubPage = pathname !== '/admin'

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center flex-1 gap-4">
        <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground" onClick={onMenuToggle}>
          <Menu size={24} />
        </button>

        {isSubPage && (
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>
        )}

        <div className="hidden lg:flex items-center bg-muted rounded-md px-3 py-1.5 w-full max-w-sm">
          <Search size={18} className="text-muted-foreground mr-2 shrink-0" />
          <input 
            type="text" 
            placeholder="Search products, orders, customers..." 
            className="bg-transparent border-none outline-none w-full text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l pl-4 ml-2">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium leading-none truncate max-w-[120px] lg:max-w-[200px]">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px] lg:max-w-[200px]">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
