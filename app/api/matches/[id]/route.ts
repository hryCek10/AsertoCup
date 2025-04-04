// app/api/matches/[id]/route.ts

import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(
    req: Request,
    context: { params: { id: string } }
) {
    const matchId = Number(context.params.id)
    const data = await req.json()

    const updatedMatch = await prisma.match.update({
        where: { id: matchId },
        data: {
            teamAId: data.teamAId,
            teamBId: data.teamBId,
            startTime: new Date(data.startTime),
            teamAScore: data.teamAScore,
            teamBScore: data.teamBScore,
            status: data.status,
        },
    })

    return NextResponse.json(updatedMatch)
}
