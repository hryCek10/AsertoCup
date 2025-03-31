import { ReactNode } from 'react'

export default function Card({ children }: { children: ReactNode }) {
    return (
        <div className="bg-card rounded-2xl shadow-soft p-4">
            {children}
        </div>
    )
}
