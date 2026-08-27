import { User } from '../../payload/payload-types'

export const getMe = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  user: User
  token: string
}> => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  
  const res = await fetch(`${API_URL}/api/users/me`, { cache: 'no-store' });
  if (!res.ok) {
    return { user: null as any, token: '' }
  }
  
  const data = await res.json();
  return { user: data.user, token: '' }
}
