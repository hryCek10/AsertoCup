'use client'
import { useEffect, useState } from "react";
import Card from "@/app/compontents/ui/Card";
import {Shield} from "lucide-react";
import Modal from "@/app/compontents/ui/Modal";
import {Team} from "@prisma/client";

export default function TeamsPage() {
    const [teams, setTeams] = useState<Team[]>([])
    const [name, setName] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedName, setEditedName] = useState('')
    const [group, setGroup] = useState('')
    const [editGroup, setEditGroup] = useState('')
    const [logo, setLogo] = useState('')
    const [editLogo, setEditLogo] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTeam, setEditingTeam] = useState<any | null>(null)

    const [addModalOpen, setAddModalOpen] = useState(false)
    const [newTeamName, setNewTeamName] = useState('')
    const [newTeamGroup, setNewTeamGroup] = useState('')
    const [newTeamLogo, setNewTeamLogo] = useState('')

    const [logoOptions, setLogoOptions] = useState<string[]>([])

    useEffect(() => {
        fetchTeams()
        fetchLogos()
    }, []);

    const fetchTeams = async () => {
        const response = await fetch("/api/teams");
        const data = await response.json();
        setTeams(data);
    }

    const fetchLogos = async () => {
        const res = await fetch('/api/logos')
        const data = await res.json()
        setLogoOptions(data)
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
        if (!newTeamName) return

        await fetch('/api/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newTeamName,
                group: newTeamGroup,
                logo: newTeamLogo,
            }),
        })

        setAddModalOpen(false)
        setNewTeamName('')
        setNewTeamGroup('')
        setNewTeamLogo('')
        fetchTeams() // <- jeśli masz funkcję do ponownego załadowania listy
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
        setEditLogo(team.logo || '')
        setIsModalOpen(true)
    }

    const handleSaveEditTeam = async () => {
        if(!editedName.trim() || editingId === null) return
        await fetch('/api/teams', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: editingId, name: editedName, group: editGroup, logo: editLogo }),
        })
        setEditingId(null)
        setEditedName('')
        setIsModalOpen(false)
        fetchTeams()
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Drużyny</h1>

            <button
                onClick={() => setAddModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-xl mt-6 mb-6 w-full"
            >
                Dodaj drużynę
            </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {teams.map(team => (
                        <Card key={team.id}><div className="flex items-center gap-3 mb-2">
                            {team.logo ? (
                                team.logo.startsWith('/') || team.logo.startsWith('http') ? (
                                    <img
                                        src={team.logo}
                                        alt={team.name}
                                        className="w-10 h-10 object-contain rounded-full border flex-shrink-0"
                                    />
                                ) : (
                                    <span className="text-2xl">{team.logo}</span>
                                )
                            ) : (
                                <Shield className="w-6 h-6 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="font-semibold truncate">{team.name}</span>
                        </div>

                            <div className="text-sm text-gray-500 mb-4">
                                Grupa: {team.group || '–'}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditTeam(team)}
                                    className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                                >
                                    Edytuj
                                </button>
                                <button
                                    onClick={() => handleDeleteTeam(team.id)}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
                                >
                                    Usuń
                                </button>
                            </div>
                        </Card>
                    ))}
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <h2 className="text-lg font-bold mb-4">Edytuj drużynę</h2>

                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border px-2 py-1 rounded w-full mb-2"
                            placeholder="Nazwa drużyny"
                        />
                        <input
                            type="text"
                            value={editGroup}
                            onChange={(e) => setEditGroup(e.target.value)}
                            className="border px-2 py-1 rounded w-full mb-2"
                            placeholder="Grupa"
                        />
                        <input
                            type="text"
                            value={editLogo}
                            onChange={(e) => setEditLogo(e.target.value)}
                            className="border px-2 py-1 rounded w-full mb-4"
                            placeholder="Logo (emoji lub URL)"
                        />

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleSaveEditTeam}
                                className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                            >
                                Zapisz
                            </button>
                        </div>
                    </Modal>
                    <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
                        <h2 className="text-lg font-bold mb-4">Dodaj drużynę</h2>

                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="border px-2 py-1 rounded w-full mb-2"
                            placeholder="Nazwa drużyny"
                        />
                        <input
                            type="text"
                            value={newTeamGroup}
                            onChange={(e) => setNewTeamGroup(e.target.value)}
                            className="border px-2 py-1 rounded w-full mb-4"
                            placeholder="Grupa"
                        />

                        <label className="block mb-1 text-sm font-medium text-gray-700">Logo</label>
                        <select
                            value={newTeamLogo}
                            onChange={(e) => setNewTeamLogo(e.target.value)}
                            className="border px-2 py-1 rounded w-full mb-4"
                        >
                            <option value="">Wybierz logo</option>
                            {logoOptions.map((logo) => (
                                <option key={logo} value={logo}>
                                    {logo.replace('/logos/', '')}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={handleAddTeam}
                                className="bg-primary text-white px-3 py-1 rounded-md text-sm"
                            >
                                Dodaj
                            </button>
                        </div>
                    </Modal>

                </div>
        </div>
    )
}