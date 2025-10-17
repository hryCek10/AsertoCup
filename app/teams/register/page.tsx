'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Player {
    name: string
    jersey: number
}

export default function RegisterTeamPage() {
    const router = useRouter()
    const [teamName, setTeamName] = useState('')
    const [players, setPlayers] = useState<Player[]>([
        { name: '', jersey: 1 },
        { name: '', jersey: 2 },
        { name: '', jersey: 3 },
        { name: '', jersey: 4 },
        { name: '', jersey: 5 },
    ])
    const [gdprConsent, setGdprConsent] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const updatePlayer = (index: number, field: 'name' | 'jersey', value: string | number) => {
        const newPlayers = [...players]
        newPlayers[index] = { ...newPlayers[index], [field]: value }
        setPlayers(newPlayers)
    }

    const addPlayer = () => {
        setPlayers([...players, { name: '', jersey: players.length + 1 }])
    }

    const removePlayer = (index: number) => {
        if (players.length > 1) {
            setPlayers(players.filter((_, i) => i !== index))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Walidacja
        if (!teamName.trim()) {
            setError('Nazwa zespołu jest wymagana')
            return
        }

        const filledPlayers = players.filter(p => p.name.trim())
        if (filledPlayers.length === 0) {
            setError('Dodaj przynajmniej jednego zawodnika')
            return
        }

        if (!gdprConsent) {
            setError('Musisz wyrazić zgodę na przetwarzanie danych osobowych')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/teams/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    teamName,
                    players: filledPlayers,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Błąd podczas zgłaszania zespołu')
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/teams')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Wystąpił błąd. Spróbuj ponownie.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold mb-2">Zgłoszenie wysłane!</h2>
                    <p className="text-gray-600 mb-4">
                        Twój zespół został pomyślnie zgłoszony. Email z potwierdzeniem został wysłany.
                    </p>
                    <p className="text-sm text-gray-500">
                        Za chwilę zostaniesz przekierowany do listy zespołów...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Powrót
                </Link>

                <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                    <h1 className="text-3xl font-bold mb-2">Zgłoś zespół</h1>
                    <p className="text-gray-600 mb-6">
                        Wypełnij formularz, aby zgłosić swój zespół do turnieju
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nazwa zespołu */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Nazwa zespołu <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="np. FC Mistrzowie"
                            />
                        </div>

                        {/* Lista zawodników */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Zawodnicy <span className="text-red-600">*</span>
                            </label>
                            <div className="space-y-3">
                                {players.map((player, index) => (
                                    <div key={index} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={player.name}
                                            onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Imię i nazwisko"
                                        />
                                        <input
                                            type="number"
                                            value={player.jersey}
                                            onChange={(e) => updatePlayer(index, 'jersey', parseInt(e.target.value) || 0)}
                                            className="w-20 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Nr"
                                            min="0"
                                            max="99"
                                        />
                                        {players.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePlayer(index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addPlayer}
                                className="mt-3 text-sm text-primary hover:text-red-700 font-medium"
                            >
                                + Dodaj zawodnika
                            </button>
                        </div>

                        {/* Zgoda GDPR */}
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={gdprConsent}
                                    onChange={(e) => setGdprConsent(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">
                                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu zgłoszenia
                                    zespołu do turnieju. <span className="text-red-600">*</span>
                                </span>
                            </label>
                        </div>

                        {/* Błąd */}
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Przycisk submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Wysyłanie...' : 'Zgłoś zespół'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}