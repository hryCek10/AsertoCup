'use client'

import { useEffect, useState } from "react";
import { calculateGroupTables} from "@/lib/tournament";

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

  const liveMatches = matches.filter((m: any) => m.status === 'in_progress')
  const groupTables = calculateGroupTables(teams, matches);

  return (
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Turniej na żywo</h1>

        {/* 🔴 Mecze w trakcie */}
        {liveMatches.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Trwające mecze</h2>
              <div className="flex overflow-x-auto gap-4 pb-4">
                {liveMatches.map((match: any) => (
                    <div
                        key={match.id}
                        className="min-w-[200px] bg-white shadow-md rounded p-4 border flex-shrink-0"
                    >
                      <div className="font-semibold text-center mb-2">
                        {match.teamA.name} vs {match.teamB.name}
                      </div>
                      <div className="text-2xl font-bold text-center">
                        {match.teamAScore} : {match.teamBScore}
                      </div>
                    </div>
                ))}
              </div>
            </>
        )}

        {/* 📊 Tabele grupowe */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tabele grupowe</h2>
          {Object.keys(groupTables).sort().map(group => (
              <div key={group} className="mb-6">
                <h3 className="text-lg font-medium mb-2">Grupa {group}</h3>
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
                  {groupTables[group].map(team => (
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
      </div>
  )
}