import '@/app/globals.css'
import type { Metadata } from 'next'
import { AppProvider } from '@toolpad/core/AppProvider'
import { ReactNode } from 'react'
import { MenuBar } from '@/components/MenuBar'
import { appName } from '@/constants/general'
import { NotificationsProvider } from '@toolpad/core'
import { Box } from '@mui/material'
import { AuthProvider } from '@/contexts/Auth'

export const metadata: Metadata = {
    title: `Panel - ${appName}`,
    description: 'Aplikacja do zarządzania przepisami',
}

const DashboardLayout = ({
    children,
}: Readonly<{
    children: ReactNode
}>) => (
    <AuthProvider>
        <AppProvider>
            <NotificationsProvider
                slotProps={{
                    snackbar: {
                        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
                    },
                }}
            >
                <Box
                    style={{
                        height: '100vh',
                    }}
                >
                    <MenuBar />
                    {children}
                </Box>
            </NotificationsProvider>
        </AppProvider>
    </AuthProvider>
)

export default DashboardLayout
