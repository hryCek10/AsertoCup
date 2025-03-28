import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const matches = await prisma.match.findMany({
        include: {
            teamA: true,
            teamB: true,
        },
        orderBy: { startTime: 'asc' },
    })
    return NextResponse.json(matches)
}

export async function POST(req: Request) {
    const body = await req.json()

    if (!body.teamAId || !body.teamBId || !body.startTime) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const match = await prisma.match.create({
        data: {
            teamAId: Number(body.teamAId),
            teamBId: Number(body.teamBId),
            startTime: new Date(body.startTime),
            status: 'scheduled',
        },
    })

    return NextResponse.json(match)
}

export async function PUT(req: Request) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json({ error: 'Missing match ID' }, { status: 400 })
    }

    const match = await prisma.match.update({
        where: { id: body.id },
        data: {
            teamAScore: Number(body.teamAScore),
            teamBScore: Number(body.teamBScore),
            status: body.status,
        },
    })

    return NextResponse.json(match)
}

export async function DELETE(req: Request) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json({ error: 'Missing match ID' }, { status: 400 })
    }

    try {
        const deleted = await prisma.match.delete({
            where: { id: body.id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        return NextResponse.json({ error: 'Nie udało się usunąć meczu' }, { status: 500 })
    }
}
