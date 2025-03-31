// app/api/teams/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    const teams = await prisma.team.findMany()
    return NextResponse.json(teams)
}

export async function POST(req: Request) {
    const body = await req.json()

    if (!body.name || !body.group) {
        return NextResponse.json({ error: 'Name and group are required' }, { status: 400 })
    }

    const newTeam = await prisma.team.create({
        data: {
            name: body.name,
            group: body.group,
            logo: body.logo || null,
        },
    })

    return NextResponse.json(newTeam)
}

export async function DELETE(request: Request) {
    const body = await request.json()

    const deleted = await prisma.team.delete({
        where: { id: body.id },
    })
    return NextResponse.json(deleted)
}

export async function PUT(req: Request) {
    const body = await req.json()

    if (!body.id || !body.name || !body.group) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const updated = await prisma.team.update({
        where: { id: body.id },
        data: {
            name: body.name,
            group: body.group,
            logo: body.logo || null,
        },
    })

    return NextResponse.json(updated)
}