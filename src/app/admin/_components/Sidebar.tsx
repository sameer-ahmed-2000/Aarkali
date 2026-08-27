import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Image as ImageIcon,
  Tag,
  Ticket,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/categories', icon: Tag, label: 'Categories' },
  { href: '/admin/users', icon: Users, label: 'Customers' },
  { href: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">Aarkali Admin</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 mt-auto border-t space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ShoppingCart size={20} />
          <span className="font-medium">Go to Storefront</span>
        </Link>
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Log out</span>
        </Link>
      </div>
      </aside>
    </>
  )
}
