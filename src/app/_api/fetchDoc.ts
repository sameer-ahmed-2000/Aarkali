import type { Config } from '../../payload/payload-types'

export const fetchDoc = async <T>(args: {
  collection: keyof Config['collections']
  slug?: string
  id?: string
  draft?: boolean
}): Promise<T> => {
  const { collection, slug, id } = args || {}
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  let url = `${API_URL}/api/${collection}`;
  if (id) {
    url = `${API_URL}/api/${collection}/${id}`;
  } else if (slug) {
    url = `${API_URL}/api/${collection}?slug=${slug}`;
  }

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('Error fetching doc')
  
  const data = await res.json();
  if (id) return data;
  if (slug) return data.docs?.[0] || null;
  return data;
}
