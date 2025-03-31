'use client'

import { ReactNode } from 'react'

export default function Modal({
                                  children,
                                  isOpen,
                                  onClose,
                              }: {
    children: ReactNode
    isOpen: boolean
    onClose: () => void
}) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}
