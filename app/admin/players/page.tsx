'use client'

import {use, useEffect, useState} from 'react'

export default function PlayersPage(){
    const [players, setPlayers] = useState([])
    const [teams, setTeams] = useState([])
    const [name, setName] = useState('')
    const [jersey, setJersey] = useState('')
    const [teamId, setTeamId] = useState('')

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editName, setEditName] = useState('')
    const [editJersey, setEditJersey] = useState('')
    const [editTeamId, setEditTeamId] = useState('')

    const fetchPlayers = async () => {
        const res = await fetch('/api/players')
        const data = await res.json()
        setPlayers(data)
    }

    const fetchTeams = async () => {
        const res = await fetch('/api/teams')
        const data = await res.json()
        setTeams(data)
    }

    useEffect(() => {
        fetchTeams()
        fetchPlayers()
    }, [])

    const handleAddPlayer = async () => {
        if (!name.trim() || !jersey) return
        await fetch('/api/players', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                jersey,
                teamId: parseInt(teamId),
            })
        })

        setName('')
        setJersey('')
        setTeamId('')

        fetchPlayers()
    }

    const handleDeletePlayer = async (id: number) => {
        await fetch('/api/players', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        })
        fetchPlayers()
    }

    const startEdit = (player: any) => {
        setEditingId(player.id)
        setEditName(player.name)
        setEditJersey(String(player.jersey))
        setEditTeamId(String(player.teamId))
    }

    const handleSaveEdit = async () => {
        if (!editName.trim() || !editJersey || !editTeamId || editingId === null) return

        await fetch('/api/players', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: editingId,
                name: editName,
                jersey: parseInt(editJersey),
                teamId: parseInt(editTeamId),
            }),
        })

        setEditingId(null)
        setEditName('')
        setEditJersey('')
        setEditTeamId('')
        fetchPlayers()
    }

    return (<div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Zawodnicy</h1>

        <div className="mb-6 space-y-2">
            <input
                type="text"
                placeholder="Imię i nazwisko"
                value={name}
                onChange={e => setName(e.target.value)}
                className="border px-4 py-2 rounded w-full"
            />
            <input
                type="number"
                placeholder="Numer"
                value={jersey}
                onChange={e => setJersey(e.target.value)}
                className="border px-4 py-2 rounded w-full"
            />
            <select
                value={teamId}
                onChange={e => setTeamId(e.target.value)}
                className="border px-4 py-2 rounded w-full"
            >
                <option value="">Wybierz drużynę</option>
                {teams.map((team: any) => (
                    <option key={team.id} value={team.id}>
                        {team.name}
                    </option>
                ))}
            </select>
            <button
                onClick={handleAddPlayer}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Dodaj zawodnika
            </button>
        </div>

            <ul className="space-y-2 mt-6">
                {players.map((player: any) => (
                    <li
                        key={player.id}
                        className="flex flex-col gap-2 border p-3 rounded"
                    >
                        {editingId === player.id ? (
                            <>
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    className="border p-1 rounded"
                                    placeholder="Imię i nazwisko"
                                />
                                <input
                                    type="number"
                                    value={editJersey}
                                    onChange={e => setEditJersey(e.target.value)}
                                    className="border p-1 rounded"
                                    placeholder="Numer"
                                />
                                <select
                                    value={editTeamId}
                                    onChange={e => setEditTeamId(e.target.value)}
                                    className="border p-1 rounded"
                                >
                                    <option value="">Wybierz drużynę</option>
                                    {teams.map((team: any) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                    >
                                        Zapisz
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="text-gray-600"
                                    >
                                        Anuluj
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <div className="font-semibold">{player.name}</div>
                                    <div className="text-sm text-gray-600">
                                        #{player.jersey} – {player.team?.name}
                                    </div>
                                </div>
                                <div className="flex gap-4 text-sm text-blue-600">
                                    <button onClick={() => startEdit(player)}>Edytuj</button>
                                    <button
                                        onClick={() => handleDeletePlayer(player.id)}
                                        className="text-red-600"
                                    >
                                        Usuń
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
    </div>
)
}