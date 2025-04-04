'use client'

import { Shield, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

type Team = {
    name: string
    logo?: string
}

type Match = {
    id: number
    teamA: Team
    teamB: Team
    teamAScore: number | null
    teamBScore: number | null
    startTime: string
    status: 'scheduled' | 'in_progress' | 'finished'
}

type MatchCardProps = {
    match: Match
    onEdit: (match: Match) => void
    onDelete: (id: number) => void
}

export default function MatchCard({ match, onEdit, onDelete }: MatchCardProps) {
    const { teamA, teamB, teamAScore, teamBScore, startTime } = match

    const renderTeam = (team: Team) => (
        <div className="flex items-center gap-2">
            {team.logo ? (
                team.logo.startsWith('/') || team.logo.startsWith('http') ? (
                    <img
                        src={team.logo}
                        alt={team.name}
                        className="w-6 h-6 object-contain rounded-full border"
                    />
                ) : (
                    <span className="text-xl">{team.logo}</span>
                )
            ) : (
                <Shield className="w-5 h-5 text-gray-400" />
            )}
            <span className="truncate">{team.name}</span>
        </div>
    )

    const statusMap = {
        scheduled: { label: 'Zaplanowany', color: 'bg-yellow-100 text-yellow-800' },
        in_progress:   { label: 'W trakcie', color: 'bg-green-100 text-green-700' },
        finished:  { label: 'Zakończony', color: 'bg-red-100 text-red-700' },
    }

    const status = statusMap[match.status as keyof typeof statusMap]

    return (
        <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between h-full">
            <div>
                <div className="text-xs text-gray-500 text-center mb-1">
                    {format(new Date(startTime), 'dd.MM.yyyy HH:mm')}
                </div>
                <div
                    className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${status.color} mb-3 text-center`}
                >
                    {status.label}
                </div>
                <div className="flex items-center justify-between">
                    {renderTeam(teamA)}
                    <span className="text-lg font-bold text-gray-800">
            {teamAScore ?? '-'} : {teamBScore ?? '-'}
          </span>
                    {renderTeam(teamB)}
                </div>
            </div>

            {/* Edytuj / Usuń */}
            <div className="flex justify-end gap-2 mt-4">
                <button
                    onClick={() => onEdit(match)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={() => onDelete(match.id)}
                    className="text-sm text-red-600 hover:underline flex items-center gap-1"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}
