import React from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import './admin.css'
import { AdminLayoutWrapper } from './_components/AdminLayoutWrapper'

export const metadata = {
  title: 'Admin Dashboard | Aarkali',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || !(session.user as any).roles?.includes('admin')) {
    redirect('/login?redirect=/admin')
  }

  return <AdminLayoutWrapper user={session.user}>{children}</AdminLayoutWrapper>
}
