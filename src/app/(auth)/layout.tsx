import '@/app/globals.css'
import { NotificationsProvider } from '@toolpad/core'
import { AppProvider } from '@toolpad/core/AppProvider'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { appName } from '@/constants/general'
import { Box } from '@mui/material'

export const metadata: Metadata = {
    title: `Logowanie - ${appName}`,
    description: 'Aplikacja do zarządzania przepisami',
}

const AuthLayout = ({
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
            <Box
                style={{
                    height: '100vh',
                }}
            >
                {children}
            </Box>
        </NotificationsProvider>
    </AppProvider>
)

export default AuthLayout
