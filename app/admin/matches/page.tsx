'use client'

import { useEffect, useState } from 'react'
import Card from "@/app/compontents/ui/Card";

export default function MatchesPage() {
    const [matches, setMatches] = useState([])
    const [teams, setTeams] = useState([])
    const [teamAId, setTeamAId] = useState('')
    const [teamBId, setTeamBId] = useState('')


    const [editingId, setEditingId] = useState<number | null>(null)
    const [teamAScore, setTeamAScore] = useState('')
    const [teamBScore, setTeamBScore] = useState('')
    const [status, setStatus] = useState('')

    const getTodayAtNoon = () => {
        const now = new Date()
        now.setHours(12, 0, 0, 0) // 12:00:00
        return now.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:MM"
    }

    const [startTime, setStartTime] = useState(getTodayAtNoon)

    useEffect(() => {
        fetchMatches()
        fetchTeams()
    }, [])

    const fetchMatches = async () => {
        const res = await fetch('/api/matches')
        const data = await res.json()
        setMatches(data)
    }

    const fetchTeams = async () => {
        const res = await fetch('/api/teams')
        const data = await res.json()
        setTeams(data)
    }

    const handleAddMatch = async () => {
        if (!teamAId || !teamBId || !startTime || teamAId === teamBId) return
        await fetch('/api/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                teamAId: parseInt(teamAId),
                teamBId: parseInt(teamBId),
                startTime,
            }),
        })
        resetForm()
        fetchMatches()
    }

    const resetForm = () => {
        setTeamAId('')
        setTeamBId('')
        setStartTime(getTodayAtNoon)
    }

    const startEdit = (match: any) => {
        setEditingId(match.id)
        setTeamAScore(String(match.teamAScore))
        setTeamBScore(String(match.teamBScore))
        setStatus(match.status)
    }

    const saveEdit = async () => {
        await fetch('/api/matches', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editingId,
                teamAScore: parseInt(teamAScore),
                teamBScore: parseInt(teamBScore),
                status,
            }),
        })
        setEditingId(null)
        fetchMatches()
    }

    const deleteMatch = async (id: number) => {
        await fetch('/api/matches', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        fetchMatches()
    }

    const groupedMatches: Record<string, MatchWithTeams[]> = {}


    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Card>
            <h1 className="text-2xl font-bold mb-4">Mecze</h1>

            <div className="space-y-2 mb-6">
                <div className="flex gap-2">
                    <select
                        value={teamAId}
                        onChange={e => setTeamAId(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                    >
                        <option value="">Drużyna A</option>
                        {teams.map((team: any) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={teamBId}
                        onChange={e => setTeamBId(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                    >
                        <option value="">Drużyna B</option>
                        {teams.map((team: any) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                />

                <button
                    onClick={handleAddMatch}
                    className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                    Dodaj mecz
                </button>
            </div>

            <ul className="space-y-4">
                {matches.map((match: any) => (
                    <li
                        key={match.id}
                        className="border p-4 rounded shadow-sm bg-white"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold">
                                {match.teamA.name} vs {match.teamB.name}
                            </div>
                            <div className="text-sm text-gray-600">
                                {new Date(match.startTime).toLocaleString()}
                            </div>
                        </div>

                        {editingId === match.id ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={teamAScore}
                                        onChange={e => setTeamAScore(e.target.value)}
                                        className="border p-1 rounded w-full"
                                        placeholder={`${match.teamA.name} – gole`}
                                    />
                                    <input
                                        type="number"
                                        value={teamBScore}
                                        onChange={e => setTeamBScore(e.target.value)}
                                        className="border p-1 rounded w-full"
                                        placeholder={`${match.teamB.name} – gole`}
                                    />
                                </div>

                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                    className="border p-1 rounded"
                                >
                                    <option value="scheduled">Zaplanowany</option>
                                    <option value="in_progress">W trakcie</option>
                                    <option value="finished">Zakończony</option>
                                </select>

                                <button
                                    onClick={saveEdit}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    Zapisz
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                <span>
                  Wynik: {match.teamAScore} : {match.teamBScore}
                </span>
                                <span className="text-sm text-gray-500 capitalize">{match.status}</span>
                                <div className="flex gap-4 text-sm text-blue-600">
                                    <button onClick={() => startEdit(match)}>Edytuj</button>
                                    <button
                                        onClick={() => deleteMatch(match.id)}
                                        className="text-red-600"
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            </Card>
        </div>
    )
}
