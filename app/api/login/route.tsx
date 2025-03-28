import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const password = body.password

    if (password === process.env.ADMIN_PASSWORD) {
        const response = NextResponse.json({ success: true })
        response.cookies.set('auth', 'ok', {
            path: '/',       // dalej bezpieczna ścieżka
            maxAge: 60 * 60, // 1h
        })
        return response
    }

    return NextResponse.json({ success: false }, { status: 401 })
}