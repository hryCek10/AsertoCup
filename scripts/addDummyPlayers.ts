import { prisma } from '../lib/prisma'
import { randomUUID } from 'crypto'

async function main() {
    const teams = await prisma.team.findMany()

    for (const team of teams) {
        const existingPlayers = await prisma.player.count({
            where: { teamId: team.id },
        })

        if (existingPlayers > 0) {
            console.log(`Pomijam ${team.name} — ma już ${existingPlayers} zawodników`)
            continue
        }

        console.log(`Dodaję graczy do drużyny: ${team.name}`)

        const players = Array.from({ length: 10 }, (_, i) => ({
            name: `Gracz${i + 1}${team.name.replace(/\s+/g, '')}`,
            jersey: i + 1,
            teamId: team.id,
            uniqueId: `${team.id}_player${i + 1}_${randomUUID().slice(0, 6)}`,
        }))

        await prisma.player.createMany({ data: players })
    }

    console.log('✔️ Gotowe!')
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
