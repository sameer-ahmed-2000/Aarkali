import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req: request })

    if (!token) {
      // Redirect to login if not authenticated
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Check if user is an admin
    const roles = token.roles as string[] | undefined
    if (!roles?.includes('admin')) {
      // Redirect to home or unauthorized page if not an admin
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
