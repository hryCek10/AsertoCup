import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(){
    const players = await prisma.player.findMany({
        include: {
            team: true,
        }
    })
    return NextResponse.json(players)
}

export async function POST(req: Request){
    const body = await req.json()

    if (!body.name || !body.jersey || !body.teamId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const player = await prisma.player.create({
        data:{
            name: body.name,
            jersey: Number(body.jersey),
            teamId: Number(body.teamId),
            uniqueId : crypto.randomUUID()
        }
    })

    return NextResponse.json(player)
}

export async function PUT(req: Request) {
    const body = await req.json()

    if (!body.id || !body.name || !body.jersey || !body.teamId) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    try {
        const updated = await prisma.player.update({
            where: { id: body.id },
            data: {
                name: body.name,
                jersey: Number(body.jersey),
                teamId: Number(body.teamId),
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Nie udało się zaktualizować zawodnika' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const body = await req.json()

    if (!body.id) {
        return NextResponse.json({ error: 'Missing player ID' }, { status: 400 })
    }

    try {
        const deleted = await prisma.player.delete({
            where: { id: body.id },
        })

        return NextResponse.json(deleted)
    } catch (error) {
        return NextResponse.json({ error: 'Nie udało się usunąć zawodnika' }, { status: 500 })
    }
}