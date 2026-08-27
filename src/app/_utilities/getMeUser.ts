import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}) => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (validUserRedirect && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && !user) {
    redirect(nullUserRedirect)
  }

  return {
    user,
    token: 'next-auth-session',
  }
}
