'use client'

import { useEffect, useState } from 'react'
import { calculateGroupTables } from '@/lib/tournament'

export default function GroupsPage() {
    const [teams, setTeams] = useState([])
    const [matches, setMatches] = useState([])

    useEffect(() => {
    const fetchData = async () => {
        const resTeams = await fetch('/api/teams')
        const resMatches = await fetch('/api/matches')


        const teamData = await resTeams.json()
        const matchData = await resMatches.json()

        setTeams(teamData)
        setMatches(matchData)
    }
    fetchData() }, [])

    const tables = calculateGroupTables(teams,matches)

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tabela Grupowa</h1>

            {Object.keys(tables).sort().map(group => (
                <div key={group} className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Grupa {group}</h2>
                    <table className="w-full border-collapse border text-sm">
                        <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border p-2">Drużyna</th>
                            <th className="border p-2 text-center">Pkt</th>
                            <th className="border p-2 text-center">+G</th>
                            <th className="border p-2 text-center">-G</th>
                            <th className="border p-2 text-center">+/-</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tables[group].map(team => (
                            <tr key={team.teamId}>
                                <td className="border p-2">{team.teamName}</td>
                                <td className="border p-2 text-center">{team.points}</td>
                                <td className="border p-2 text-center">{team.goalsFor}</td>
                                <td className="border p-2 text-center">{team.goalsAgainst}</td>
                                <td className="border p-2 text-center">{team.goalDiff}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    )
}