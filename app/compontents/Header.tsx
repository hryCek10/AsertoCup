'use client'

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
                <AdminSidebar />
                <h1 className="text-xl font-bold text-center flex-1">Turniej 2024</h1>
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
