import type { Metadata } from 'next'
import '@/app/globals.css'
import { ReactNode } from 'react'
import { appName } from '@/constants/general'

export const metadata: Metadata = {
    title: appName,
    description: 'Aplikacja do zarządzania przepisami',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="pl-PL" data-toolpad-color-scheme="dark">
            <body>{children}</body>
        </html>
    )
}
