import '@/app/globals.css'
import type { Metadata } from 'next'
import { AppProvider } from '@toolpad/core/AppProvider'
import { ReactNode } from 'react'
import { MenuBar } from '@/app/(dashboard)/MenuBar'
import { appName } from '@/constants/general'
import { NotificationsProvider } from '@toolpad/core'

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
        <NotificationsProvider
            slotProps={{
                snackbar: {
                    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                },
            }}
        >
            <div
                style={{
                    maxHeight: '100vh',
                    minHeight: '100vh',
                }}
            >
                <MenuBar />
                {children}
            </div>
        </NotificationsProvider>
    </AppProvider>
)

export default DashboardLayout
