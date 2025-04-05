type Match = {
    teamAId: number
    teamBId: number
    teamAScore: number
    teamBScore: number
    status: string
}

type Team = {
    id: number
    name: string
    logo: string | null
    group: string | null
}

type TableRow = {
    teamId: number
    teamName: string
    logo?: string | null
    points: number
    goalsFor: number
    goalsAgainst: number
    goalDiff: number
    group: string
}

export function calculateGroupTables(teams: Team[], matches: Match[]): Record<string, TableRow[]> {
    const table: Record<string, Record<number, TableRow>> = {}

    for (const team of teams) {
        if (!team.group) continue
        if (!table[team.group]) table[team.group] = {}

        table[team.group][team.id] = {
            teamId: team.id,
            teamName: team.name,
            logo: team.logo,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDiff: 0,
            group: team.group
        }
    }

    for (const match of matches) {
        if (match.status !== 'finished') continue

        const teamA = table?.[teams.find(t => t.id === match.teamAId)?.group || '']?.[match.teamAId]
        const teamB = table?.[teams.find(t => t.id === match.teamBId)?.group || '']?.[match.teamBId]

        if (!teamA || !teamB) continue

        teamA.goalsFor += match.teamAScore
        teamA.goalsAgainst += match.teamBScore
        teamA.goalDiff = teamA.goalsFor - teamA.goalsAgainst

        teamB.goalsFor += match.teamBScore
        teamB.goalsAgainst += match.teamAScore
        teamB.goalDiff = teamB.goalsFor - teamB.goalsAgainst

        if (match.teamAScore > match.teamBScore) {
            teamA.points += 3
        } else if (match.teamAScore < match.teamBScore) {
            teamB.points +=3
        } else {
            teamA.points += 1
            teamB.points += 1
        }
    }

    const result: Record<string, TableRow[]> = {}

    for (const group of Object.keys(table)) {
        result[group] = Object.values(table[group]).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points
            if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
            return b.goalsFor - a.goalsFor
        })
    }

    return result
}