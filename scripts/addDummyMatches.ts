// scripts/addDummyMatches.ts
import { prisma } from '../lib/prisma'
async function main() {
    const teams = await prisma.team.findMany()
    // przykładowe mecze w grupach A i B
    // np. dla grupy A: teams[0] vs teams[1], etc.
    await prisma.match.createMany({
        data: [
            { teamAId: teams[0].id, teamBId: teams[1].id, startTime: new Date(), status: 'scheduled' },
            // więcej...
        ]
    })
}
main().catch(e => { console.error(e); process.exit(1) })
