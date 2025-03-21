import '@/app/globals.css'
import type { Metadata } from 'next'
import { AppProvider } from '@toolpad/core/AppProvider'
import { ReactNode } from 'react'
import { appName } from '@/constants/general'
import { NotificationsProvider } from '@toolpad/core'
import { Box } from '@mui/material'

export const metadata: Metadata = {
    title: `Logowanie - ${appName}`,
    description: 'Aplikacja do zarządzania przepisami',
}

const LoginLayout = ({
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
                    maxHeight: '100vh',
                    minHeight: '100vh',
                }}
            >
                {children}
            </Box>
        </NotificationsProvider>
    </AppProvider>
)

export default LoginLayout
