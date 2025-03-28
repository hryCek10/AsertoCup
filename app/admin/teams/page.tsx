'use client'
import { useEffect, useState } from "react";

export default function TeamsPage() {
    const [teams, setTeams] = useState([])
    const [name, setName] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedName, setEditedName] = useState('')
    const [group, setGroup] = useState('')
    const [editGroup, setEditGroup] = useState('')

    useEffect(() => {
        fetchTeams()
    }, []);

    const fetchTeams = async () => {
        const response = await fetch("/api/teams");
        const data = await response.json();
        setTeams(data);
    }

    const addTeam = async () => {
        await fetch("/api/teams/", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        })

        setName('')
        const res = await fetch("/api/teams")
        const data = await res.json()
        setTeams(data);
    }

    const handleAddTeam = async () => {
        if (!name.trim() || !group) return

        await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, group }),
        })

        setName('')
        setGroup('')
        fetchTeams()
    }

    const handleDeleteTeam = async (id: number) => {
        await fetch(`/api/teams`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        fetchTeams()
    }

    const handleEditTeam = (team: any) => {
        setEditingId(team.id)
        setEditedName(team.name)
        setEditGroup(team.group || '')
    }

    const handleSaveEditTeam = async () => {
        if(!editedName.trim() || editingId === null) return
        await fetch('/api/teams', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingId, name: editedName, group: editGroup }),
        })
        setEditingId(null)
        setEditedName('')
        fetchTeams()
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Drużyny</h1>

            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Nazwa drużyny"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="border px-4 py-2 rounded w-full"
                />
                <select
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Wybierz grupę</option>
                    <option value="A">Grupa A</option>
                    <option value="B">Grupa B</option>
                    <option value="C">Grupa C</option>
                    <option value="D">Grupa D</option>
                </select>
                <button
                    onClick={handleAddTeam}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Dodaj
                </button>
            </div>

            <ul className="space-y-2">
                {teams.map((team: any) => (
                    <li key={team.id} className="flex items-center justify-between border p-2 rounded">
                        {editingId === team.id ? (
                            <>
                                <input
                                    value={editedName}
                                    onChange={e => setEditedName(e.target.value)}
                                    className="border p-1 rounded w-full mr-2"
                                />
                                <select
                                    value={editGroup}
                                    onChange={e => setEditGroup(e.target.value)}
                                    className="border p-1 rounded w-full"
                                >
                                    <option value="">Wybierz grupę</option>
                                    <option value="A">Grupa A</option>
                                    <option value="B">Grupa B</option>
                                    <option value="C">Grupa C</option>
                                    <option value="D">Grupa D</option>
                                </select>
                                <button
                                    onClick={handleSaveEditTeam}
                                    className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                                >
                                    Zapisz
                                </button>
                                <button onClick={() => setEditingId(null)} className="text-gray-500">
                                    Anuluj
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{team.name}</span>
                                <span>{team.group}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditTeam(team)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Edytuj
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTeam(team.id)}
                                        className="text-sm text-red-600 hover:underline"
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