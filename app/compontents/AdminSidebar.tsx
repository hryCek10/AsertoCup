'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Menu,
    X,
    Users,
    Shield,
    Group,
    LayoutDashboard, Clock,
} from 'lucide-react'

const links = [
    { href: '/admin/teams', label: 'Drużyny', icon: Users },
    { href: '/admin/players', label: 'Zawodnicy', icon: Shield },
    { href: '/admin/matches', label: 'Mecze', icon: Clock },
    { href: '/admin/groups', label: 'Grupy', icon: Group },
]

export default function AdminSidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto'
    }, [isMobileOpen])

    return (
        <>
            {/* Burger button for mobile */}
            <div className="md:hidden px-4 py-2">
                <button onClick={() => setIsMobileOpen(true)}>
                    <Menu size={28} />
                </button>
            </div>

            {/* Mobile overlay menu */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileOpen(false)}>
                    <div
                        className="absolute left-0 top-0 h-full w-64 bg-white p-4 shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold">Panel Admina</span>
                            <button onClick={() => setIsMobileOpen(false)}>
                                <X />
                            </button>
                        </div>
                        <SidebarLinks pathname={pathname} onLinkClick={() => setIsMobileOpen(false)} />
                    </div>
                </div>
            )}

            {/* Desktop sidebar (always visible, hover-expandable) */}
            <aside className="hidden md:flex flex-col h-screen fixed top-0 left-0 z-30 bg-white border-r shadow-lg transition-all duration-300 group hover:w-64 w-16">
                <div className="flex items-center gap-2 px-4 py-6 transition-all duration-200">
                    <LayoutDashboard size={20} className="min-w-[20px]" />
                    <span className="text-sm font-bold opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition duration-200 origin-left">
            Panel Admina
          </span>
                </div>
                <SidebarLinks pathname={pathname} />
            </aside>
        </>
    )
}

function SidebarLinks({
                          pathname,
                          onLinkClick,
                      }: {
    pathname: string
    onLinkClick?: () => void
}) {
    return (
        <nav className="flex flex-col gap-2 px-2">
            {links.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onLinkClick}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                            active
                                ? 'bg-primary text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Icon size={20} className="min-w-[20px]" />
                        <span
                            className="opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition origin-left duration-200"
                        >
              {label}
            </span>
                    </Link>
                )
            })}
        </nav>
    )
}
