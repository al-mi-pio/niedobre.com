import '@/app/globals.css'
import type { Metadata } from 'next'
import { AppProvider } from '@toolpad/core/AppProvider'
import { ReactNode } from 'react'
import { MenuBar } from '@/app/(dashboard)/MenuBar'
import { appName } from '@/constants/general'

export const metadata: Metadata = {
    title: `Panel - ${appName}`,
    description: 'Aplikacja do zarządzania przepisami',
}

const DashboardLayout = ({
    children,
}: Readonly<{
    children: ReactNode
}>) => (
    <AppProvider>
        <div
            style={{
                maxHeight: '100vh',
                minHeight: '100vh',
            }}
        >
            <MenuBar />
            {children}
        </div>
    </AppProvider>
)

export default DashboardLayout
