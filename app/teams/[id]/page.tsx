// app/teams/[id]/page.tsx

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Shield } from 'lucide-react'
import {calculateGroupTables} from "@/lib/tournament";


export default async function TeamDetails({
                                              params,
                                          }: {
    params: { id: string }
}) {
    const teamId = Number(params.id)

    const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { players: true },
    })

    if (!team) return notFound()

    const [teams, matches] = await Promise.all([
        prisma.team.findMany(),
        prisma.match.findMany(),
    ])

    const groupTables = calculateGroupTables(teams, matches)
    const teamGroupTable = groupTables[team.group ?? ''] || []


    return (
        <div className="p-4">
            <div className="flex flex-col items-center text-center mb-3">
                {team.logo ? (
                    team.logo.startsWith('/') || team.logo.startsWith('http') ? (
                        <img
                            src={team.logo}
                            alt={team.name}
                            className="w-24 h-24 object-contain mb-2"
                        />
                    ) : (
                        <span className="text-5xl mb-2">{team.logo}</span>
                    )
                ) : (
                    <Shield className="w-10 h-10 text-gray-400 mb-2" />
                )}
                <span className="text-lg font-semibold group-hover:text-primary transition">
    {team.name}
  </span>
            </div>

            <h2 className="text-lg font-semibold mb-2">Zawodnicy</h2>
            <ul className="space-y-2">
                {team.players.map((player) => (
                    <li key={player.id} className="border p-2 rounded bg-white">
                        {player.jersey && (
                            <span className="inline-block w-6 font-mono text-gray-600 mr-2 text-center">
                #{player.jersey}
              </span>
                        )}
                        {player.name}
                    </li>
                ))}
            </ul>

            <h2 className="text-lg font-semibold mt-6 mb-2">
                Tabela – grupa {team.group ?? '-'}
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden text-sm">
                    <thead className="bg-primary text-gray-800">
                    <tr>
                        <th className="text-left px-4 py-2">Drużyna</th>
                        <th className="text-center px-4 py-2">Pkt</th>
                        <th className="text-center px-4 py-2">+G</th>
                        <th className="text-center px-4 py-2">-G</th>
                        <th className="text-center px-4 py-2">ΔG</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teamGroupTable.map((team) => (
                        <tr key={team.teamId} className="hover:bg-gray-50">
                            <td className="px-4 py-2">{team.teamName}</td>
                            <td className="text-center px-4 py-2 font-bold">{team.points}</td>
                            <td className="text-center px-4 py-2">{team.goalsFor}</td>
                            <td className="text-center px-4 py-2">{team.goalsAgainst}</td>
                            <td className="text-center px-4 py-2">{team.goalDiff}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
