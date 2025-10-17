import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { teamName, players } = body

        // Walidacja
        if (!teamName || !teamName.trim()) {
            return NextResponse.json(
                { error: 'Nazwa zespołu jest wymagana' },
                { status: 400 }
            )
        }

        if (!players || players.length === 0) {
            return NextResponse.json(
                { error: 'Dodaj przynajmniej jednego zawodnika' },
                { status: 400 }
            )
        }

        // Tu możesz później dodać logikę zapisywania do bazy danych
        // const team = await prisma.team.create({ data: { name: teamName, ... } })

        // Logowanie do konsoli (do testów)
        console.log('Nowe zgłoszenie zespołu:')
        console.log('Nazwa:', teamName)
        console.log('Zawodnicy:', players)

        // Tu później dodasz wysyłanie emaila
        // await sendEmail({ teamName, players })

        return NextResponse.json(
            {
                success: true,
                message: 'Zespół został zgłoszony pomyślnie',
                team: { name: teamName, players }
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Błąd podczas zgłaszania zespołu:', error)
        return NextResponse.json(
            { error: 'Wystąpił błąd serwera' },
            { status: 500 }
        )
    }
}