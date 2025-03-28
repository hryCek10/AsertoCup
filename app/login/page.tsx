'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async () => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })

        if (!res.ok) {
            router.push('/admin/teams')
        } else {
            setError('Błędne hasło')
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Logowanie admina</h1>
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border px-4 py-2 rounded w-full mb-2"
            />
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                Zaloguj
            </button>
            {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
    )
}