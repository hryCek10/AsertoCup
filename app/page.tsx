'use client'

import { useEffect, useState } from "react";
import { calculateGroupTables} from "@/lib/tournament";
import TableWrapper from "@/app/compontents/ui/Table";
import {Shield} from "lucide-react";
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

  const liveMatches = matches.filter((m: any) => m.status === 'in_progress')
  const groupTables = calculateGroupTables(teams, matches);

  return (
      <div className="p-4 max-w-6xl mx-auto">

        {/* 🔴 Mecze w trakcie */}
          <div className="flex overflow-x-auto gap-4 pb-4">
              {liveMatches.map((match: any) => (
                  <div
                      key={match.id}
                      className="min-w-[280px] bg-white shadow-soft rounded-2xl p-4 border flex flex-col items-center gap-2"
                  >
                      {/* 🕒 Data */}
                      <div className="text-xs font-bold text-black-500 text-center">
                          {format(new Date(match.startTime), 'HH:mm')}
                      </div>

                      {/* 🛡️ Drużyny w jednej linii */}
                      <div className="flex items-center justify-between gap-2 w-full">
                          <TeamWithLogo logo={match.teamA.logo} name={match.teamA.name} />
                          <span className="text-sm text-primary">vs</span>
                          <TeamWithLogo logo={match.teamB.logo} name={match.teamB.name} />
                      </div>

                      {/* 🔢 Wynik pod spodem */}
                      <div className="text-2xl font-bold text-gray-800">
                          {match.teamAScore} : {match.teamBScore}
                      </div>

                      {/* 🔠 Grupa */}
                      <div className="text-xs text-gray-500 mt-1">
                          Grupa {match.teamA.group || match.teamB.group || '–'}
                      </div>


                  </div>
              ))}
          </div>

          {/* 📊 Tabele grupowe */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tabele grupowe</h2>
          {Object.keys(groupTables).sort().map(group => (
              <div key={group} className="mb-6">
                <h3 className="text-lg font-medium mb-2">Grupa {group}</h3>
                  <TableWrapper>
                      <thead className="bg-primary  font-semibold text-xs uppercase tracking-wide"><tr>
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
                                              <span className="text-xl">{team.logo}</span> // emoji
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
  )
}