import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const matches = await prisma.match.findMany({
        include: {
            teamA: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    group: true,
                },
            },
            teamB: {
                select: {
                    id: true,
                    name: true,
                    logo: true,
                    group: true,
                },
            },
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
    const data = await req.json()

    try {
        const updated = await prisma.match.update({
            where: { id: data.id },
            data: {
                teamAId: data.teamAId,
                teamBId: data.teamBId,
                startTime: new Date(data.startTime),
                teamAScore: data.teamAScore,
                teamBScore: data.teamBScore,
                status: data.status,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Błąd PUT /api/matches:', error)
        return NextResponse.json({ error: 'Coś poszło nie tak' }, { status: 500 })
    }
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
