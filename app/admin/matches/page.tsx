'use client'

import { useEffect, useState } from 'react'
import Card from "@/app/compontents/ui/Card";
import Modal from "@/app/compontents/ui/Modal";
import MatchCard from "@/app/compontents/ui/MatchCard";
import {Match, Team} from "@prisma/client";

export default function MatchesPage() {

    type MatchWithTeams = {
        id: number
        startTime: string
        teamAScore: number
        teamBScore: number
        teamA: {
            name: string
            logo?: string
            group?: string
        }
        teamB: {
            name: string
            logo?: string
            group?: string
        }
        status: string
    }

    const [matches, setMatches] = useState<MatchWithTeams[]>([])
    const [teams, setTeams] = useState([])
    const [teamAId, setTeamAId] = useState('')
    const [teamBId, setTeamBId] = useState('')



    const [isModalOpen, setIsModalOpen] = useState(false)

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

    const handleDeleteMatch = async (id: number) => {
        if (!confirm('Na pewno usunąć mecz?')) return
        await fetch('/api/matches', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        await fetchMatches() // odśwież listę
    }

    const [editingMatch, setEditingMatch] = useState<Match & {
        teamA: Team
        teamB: Team
    } | null>(null)
    const [editTeamAId, setEditTeamAId] = useState()
    const [editTeamBId, setEditTeamBId] = useState()
    const [editStartTime, setEditStartTime] = useState()
    const [editTeamAScore, setEditTeamAScore] = useState()
    const [editTeamBScore, setEditTeamBScore] = useState()
    const [editStatus, setEditStatus] = useState<'scheduled' | 'in_progress' | 'finished'>('scheduled')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleEditMatch = (match: any) => {
        setEditingMatch(match)
        setEditTeamAId(match.teamA.id)
        setEditTeamBId(match.teamB.id)
        setEditStartTime(match.startTime.slice(0, 16)) // do inputa datetime-local
        setEditTeamAScore(match.teamAScore ?? '')
        setEditTeamBScore(match.teamBScore ?? '')
        setEditStatus(match.status)
        setIsEditModalOpen(true)
    }

    const handleSaveEditedMatch = async () => {
        if(!editingMatch) return
        await fetch('/api/matches', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editingMatch.id,
                teamAId: Number(editTeamAId),
                teamBId: Number(editTeamBId),
                startTime: editStartTime,
                teamAScore: editTeamAScore === '' ? null : Number(editTeamAScore),
                teamBScore: editTeamBScore === '' ? null : Number(editTeamBScore),
                status: editStatus,
            }),
        })

        setIsEditModalOpen(false)
        setEditingMatch(null)
        await fetchMatches() // odśwież dane
    }

    const groupedMatches: Record<string, any[]> = {}

    matches.forEach((match) => {
        const group = match.teamA?.group || match.teamB?.group || 'Brak grupy'
        if (!groupedMatches[group]) groupedMatches[group] = []
        groupedMatches[group].push(match)
    })

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Card>
            <h1 className="text-2xl font-bold mb-4">Mecze</h1>

                <div className="mb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-primary text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                    >
                        + Dodaj mecz
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(groupedMatches).map(([groupName, matchesInGroup]) => (
                    <div key={groupName} className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Grupa {groupName}</h2>
                        <ul className="space-y-4">
                        {matchesInGroup.map((match: any) => (
                            <MatchCard
                                key={match.id}
                                match={match}
                                onEdit={handleEditMatch}
                                onDelete={handleDeleteMatch}
                            />
                        ))}
                    </ul>
                    </div>
                ))}
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-lg font-bold mb-4">Dodaj mecz</h2>

                    <div className="flex flex-col gap-2">
                        <select
                            value={teamAId}
                            onChange={(e) => setTeamAId(e.target.value)}
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
                            onChange={(e) => setTeamBId(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        >
                            <option value="">Drużyna B</option>
                            {teams.map((team: any) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={() => {
                                    handleAddMatch()
                                    setIsModalOpen(false)
                                }}
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                Dodaj mecz
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <h2 className="text-lg font-bold mb-4">Edytuj mecz</h2>

                    <div className="flex flex-col gap-2">
                        <select
                            value={editTeamAId}
                            onChange={(e) => setEditTeamAId(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        >
                            <option value="">Drużyna A</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={editTeamBId}
                            onChange={(e) => setEditTeamBId(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        >
                            <option value="">Drużyna B</option>
                            {teams.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="datetime-local"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                            className="border px-2 py-1 rounded w-full"
                        />

                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Wynik drużyny A"
                                value={editTeamAScore}
                                onChange={(e) => setEditTeamAScore(e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                            />
                            <input
                                type="number"
                                placeholder="Wynik drużyny B"
                                value={editTeamBScore}
                                onChange={(e) => setEditTeamBScore(e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                            />
                        </div>

                        <select
                            value={editStatus}
                            onChange={(e) =>
                                setEditStatus(e.target.value as 'scheduled' | 'in_progress' | 'finished')
                            }
                            className="border px-2 py-1 rounded w-full"
                        >
                            <option value="scheduled">Zaplanowany</option>
                            <option value="in_progress">W trakcie</option>
                            <option value="finished">Zakończony</option>
                        </select>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleSaveEditedMatch}
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                Zapisz zmiany
                            </button>
                        </div>
                    </div>
                </Modal>


            </Card>
        </div>
    )
}
