import { ReactNode } from 'react'

export default function TableWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-soft bg-white">
            <table className="w-full text-sm text-left text-gray-700">{children}</table>
        </div>
    )
}
