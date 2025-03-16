import type { Metadata } from 'next'
import './globals.css'
import React from 'react'

export const metadata: Metadata = {
    title: 'Niedobre.com',
    description: 'Aplikacja do zarządzania przepisami',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pl-PL">
            <body>{children}</body>
        </html>
    )
}
