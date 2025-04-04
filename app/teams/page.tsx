// app/teams/page.tsx

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Shield } from 'lucide-react'

export default async function TeamsPage() {
    const teams = await prisma.team.findMany({
        orderBy: { group: 'asc' },
    })

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Zgłoszone drużyny</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <Link
                        key={team.id}
                        href={`/teams/${team.id}`}
                        className="bg-white border rounded-2xl shadow-md p-4 hover:shadow-lg transition-all group"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            {team.logo ? (
                                team.logo.startsWith('/') || team.logo.startsWith('http') ? (
                                    <img
                                        src={team.logo}
                                        alt={team.name}
                                        className="w-10 h-10 object-contain rounded-full border"
                                    />
                                ) : (
                                    <span className="text-2xl">{team.logo}</span>
                                )
                            ) : (
                                <Shield className="w-6 h-6 text-gray-400" />
                            )}
                            <span className="text-lg font-semibold group-hover:text-primary transition">
                {team.name}
              </span>
                        </div>
                        <div className="text-sm text-gray-500">Grupa {team.group ?? '-'}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
