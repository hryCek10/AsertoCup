import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const isLoggedIn = req.cookies.get('auth')?.value === 'ok'
    const isLoginPage = req.nextUrl.pathname === '/admin/login'

    if (!isLoggedIn && req.nextUrl.pathname.startsWith('/admin') && !isLoginPage) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}