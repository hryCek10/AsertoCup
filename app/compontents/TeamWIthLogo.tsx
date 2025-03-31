import { Shield } from 'lucide-react'

export default function TeamWithLogo({ logo, name }: { logo?: string; name: string }) {
    return (
        <div className="flex items-center gap-2">
            {logo ? (
                logo.startsWith('/') || logo.startsWith('http') ? (
                    <img src={logo} alt={name} className="w-6 h-6 object-contain rounded-full border" />
                ) : (
                    <span className="text-xl">{logo}</span>
                )
            ) : (
                <Shield className="w-5 h-5 text-gray-400" />
            )}
            <span className="truncate">{name}</span>
        </div>
    )
}
