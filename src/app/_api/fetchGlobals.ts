import type { Footer, Header, Settings } from '../../payload/payload-types'

export async function fetchSettings(): Promise<Settings> {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const res = await fetch(`${API_URL}/api/globals/settings`, { cache: 'no-store' })
  if (!res.ok) return {} as Settings;
  return res.json()
}

export async function fetchHeader(): Promise<Header> {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const res = await fetch(`${API_URL}/api/globals/header`, { cache: 'no-store' })
  if (!res.ok) return {} as Header;
  return res.json()
}

export async function fetchFooter(): Promise<Footer> {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const res = await fetch(`${API_URL}/api/globals/footer`, { cache: 'no-store' })
  if (!res.ok) return {} as Footer;
  return res.json()
}

export const fetchGlobals = async (): Promise<{
  settings: Settings
  header: Header
  footer: Footer
}> => {
  const settings = await fetchSettings()
  const header = await fetchHeader()
  const footer = await fetchFooter()

  return { settings, header, footer }
}
