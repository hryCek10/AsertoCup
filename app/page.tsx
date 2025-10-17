'use client'

import { useEffect, useState } from "react";
import { calculateGroupTables } from "@/lib/tournament";
import TableWrapper from "@/app/compontents/ui/Table";
import { Shield } from "lucide-react";
import TeamWithLogo from "@/app/compontents/TeamWIthLogo";
import { format } from 'date-fns'

export default function PublicPage() {
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [teamsRes, matchesRes] = await Promise.all([
                fetch('/api/teams'),
                fetch('/api/matches'),
            ])

            const teamData = await teamsRes.json();
            const matchData = await matchesRes.json();

            setTeams(teamData);
            setMatches(matchData);
        }
        fetchData()
    }, [])

    const liveMatches = matches.filter((m: any) => m.status === 'in_progress').slice(0, 2); // ograniczenie do 2 meczow
    const sortedMatches = [...matches].sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const groupTables = calculateGroupTables(teams, matches);

    return (
        <div className="p-4 max-w-6xl mx-auto">
            {/* 🔴 Mecze w trakcie */}
            <h1 className="text-xl font-semibold mb-4">Mecze w Trakcie</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {liveMatches.map((match: any) => (
                    <div
                        key={match.id}
                        className="bg-white shadow-soft rounded-2xl p-4 border flex flex-col items-center gap-2"
                    >
                        <div className="text-xs font-bold text-black-500 text-center">
                            {format(new Date(match.startTime), 'HH:mm')}
                        </div>
                        <div className="flex items-center justify-between gap-2 w-full">
                            <TeamWithLogo logo={match.teamA.logo} name={match.teamA.name} />
                            <span className="text-sm text-primary">vs</span>
                            <TeamWithLogo logo={match.teamB.logo} name={match.teamB.name} />
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                            {match.teamAScore} : {match.teamBScore}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Grupa {match.teamA.group || match.teamB.group || '–'}
                        </div>
                    </div>
                ))}
            </div>

            {/* 🗓️ Harmonogram */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 ">Harmonogram Turnieju</h2>
                <ul className="space-y-2">
                    <li className="text-center">9:00 Start Turnieju</li>
                    <li className="text-center">15:45 Zakończenie rozgrywek grupowych</li>
                    <li className="text-center">17:30 Finał</li>
                    <li className="text-center">18:00 Rozdanie nagród i zakończenie turnieju</li>
                </ul>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 ">Mecze:</h2>
                <ul className="space-y-2">
                    {sortedMatches.map((match: any) => (
                        <li key={match.id} className="text-sm">
              <span className="font-medium">
                {format(new Date(match.startTime), 'HH:mm')} - {match.teamA.name} vs {match.teamB.name} - {match.teamAScore} : {match.teamBScore}
              </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 📊 Tabele grupowe */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Tabele grupowe</h2>
                {Object.keys(groupTables).sort().map(group => (
                    <div key={group} className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Grupa {group}</h3>
                        <TableWrapper>
                            <thead className="bg-primary font-semibold text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3">Drużyna</th>
                                <th className="px-4 py-3 text-center">Pkt</th>
                                <th className="px-4 py-3 text-center">+G</th>
                                <th className="px-4 py-3 text-center">-G</th>
                                <th className="px-4 py-3 text-center">+/-</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {groupTables[group].map(team => (
                                <tr key={team.teamId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {team.logo ? (
                                                team.logo.startsWith('/') || team.logo.startsWith('http') ? (
                                                    <img
                                                        src={team.logo}
                                                        alt={team.teamName}
                                                        className="w-6 h-6 object-contain rounded-full border"
                                                    />
                                                ) : (
                                                    <span className="text-xl">{team.logo}</span>
                                                )
                                            ) : (
                                                <Shield className="w-5 h-5 text-gray-400" />
                                            )}
                                            <span>{team.teamName}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold">{team.points}</td>
                                    <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                                    <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                                    <td className="px-4 py-3 text-center">{team.goalDiff}</td>
                                </tr>
                            ))}
                            </tbody>
                        </TableWrapper>
                    </div>
                ))}
            </div>
        </div>
    );
}
