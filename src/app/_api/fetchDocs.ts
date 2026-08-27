import type { Config } from '../../payload/payload-types'

export const fetchDocs = async <T>(
  collection: keyof Config['collections'],
  draft?: boolean,
): Promise<T[]> => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const res = await fetch(`${API_URL}/api/${collection}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Error fetching docs')
  
  const data = await res.json();
  return data.docs || data || [];
}
