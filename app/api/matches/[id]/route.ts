import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, context: any) {
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
