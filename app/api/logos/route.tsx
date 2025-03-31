import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import path from 'path'

export async function GET() {
    const logosDir = path.join(process.cwd(), 'public', 'logos')

    try {
        const files = await readdir(logosDir)
        const logos = files
            .filter((file) => /\.(png|jpg|jpeg|svg|webp)$/i.test(file))
            .map((file) => `/logos/${file}`)

        return NextResponse.json(logos)
    } catch (error) {
        console.error('Błąd wczytywania logotypów:', error)
        return NextResponse.json([], { status: 500 })
    }
}
