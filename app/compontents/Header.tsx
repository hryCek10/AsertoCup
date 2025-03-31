'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'

export default function Header() {
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const cookies = document.cookie.split(';').map(c => c.trim())
        const authCookie = cookies.find(c => c.startsWith('auth='))
        setIsAdmin(authCookie === 'auth=ok')
    }, [])

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        location.reload()
    }

    return (
        <header className="bg-white border-b shadow-sm">
            <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
                <div className="flex justify-center">
                    <Link href="/">
                        <Image
                            src="/aserto_cup.png" // lub np. /logo.svg
                            alt="Logo Turnieju"
                            width={200}
                            height={0}
                            className="hover:opacity-90 transition"
                            priority
                        />
                    </Link>
                </div>
                <div>
                    {isAdmin ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Wyloguj
                        </button>
                    ) : (
                        <Link href="/admin/login" className="text-sm text-blue-600 hover:underline">
                            Zaloguj
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
