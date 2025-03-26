import '@/app/globals.css'
import type { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'
import { NotificationsProvider } from '@toolpad/core'
import { AppProvider } from '@toolpad/core/AppProvider'
import { AuthProvider } from '@/contexts/Auth'
import { MenuBar } from '@/components/MenuBar'
import { Spinner } from '@/components/Spinner'
import { appName } from '@/constants/general'
import { Box } from '@mui/material'

export const metadata: Metadata = {
    title: `Panel - ${appName}`,
    description: 'Aplikacja do zarządzania przepisami',
}

const DashboardLayout = ({
    children,
}: Readonly<{
    children: ReactNode
}>) => (
    <Suspense fallback={<Spinner />}>
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
    </Suspense>
)

export default DashboardLayout
