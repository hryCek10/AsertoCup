'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, PlusCircle } from 'lucide-react'

const links = [
    { href: '/', label: 'Strona główna', icon: Home },
    { href: '/teams', label: 'Zgłoszone drużyny', icon: Users },
    // Dodasz później inne np. /wyniki, /terminarz itd.
]

export default function PublicSidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex flex-col h-screen fixed top-0 left-0 z-30 bg-white border-r shadow-lg transition-all w-16 group hover:w-64">
            <div className="flex items-center gap-2 px-4 py-6 transition-all duration-200">
                <Home size={20} className="min-w-[20px]" />
                <span className="text-sm font-bold opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition duration-200 origin-left">
          Turniej
        </span>
            </div>
            <nav className="flex flex-col gap-2 px-2 flex-1">
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                active
                                    ? 'bg-primary text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <Icon size={20} className="min-w-[20px]" />
                            <span className="opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition origin-left duration-200">
                {label}
              </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Przycisk zgłoś zespół na dole */}
            <div className="px-2 pb-4">
                <Link
                    href="/teams/register"
                    className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 bg-red-600 text-white hover:bg-red-700"
                >
                    <PlusCircle size={20} className="min-w-[20px]" />
                    <span className="opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition origin-left duration-200">
                        Zgłoś zespół
                    </span>
                </Link>
            </div>
        </aside>
    )
}
