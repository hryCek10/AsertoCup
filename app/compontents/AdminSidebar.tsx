'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function AdminSidebar() {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="relative">
            <button
                className="text-2xl px-2 py-1"
                onClick={() => setOpen(!open)}
            >
                ☰
            </button>

            {open && (
                <div className="absolute left-0 top-10 bg-white border shadow-lg rounded p-4 z-50 w-48">
                    <nav className="flex flex-col gap-2">
                        <Link href="/" onClick={() => setOpen(false)} className="hover:underline">
                            Strona Główna
                        </Link>
                        <Link href="/admin/teams" onClick={() => setOpen(false)} className="hover:underline">
                            Drużyny
                        </Link>
                        <Link href="/admin/players" onClick={() => setOpen(false)} className="hover:underline">
                            Zawodnicy
                        </Link>
                        <Link href="/admin/matches" onClick={() => setOpen(false)} className="hover:underline">
                            Mecze
                        </Link>
                        <Link href="/admin/groups" onClick={() => setOpen(false)} className="hover:underline">
                            Grupy
                        </Link>
                        {/* Dodamy więcej później */}
                    </nav>
                </div>
            )}
        </div>
    )
}