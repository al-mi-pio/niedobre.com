'use client'

import CakeIcon from '@mui/icons-material/Cake'
import { useRouter } from 'next/navigation'
import { MouseEvent, useState } from 'react'
import { appName } from '@/constants/general'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'

const settings = [{ label: 'Wyloguj', pathname: '/logout' }]
const pages = [
    { label: 'Kalkulator', pathname: '/' },
    { label: 'Przepisy', pathname: '/recipes' },
    { label: 'Składniki', pathname: '/ingredients' },
]

const AppLogo = () => (
    <>
        <CakeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
            }}
        >
            {appName}
        </Typography>
    </>
)

const UserSettings = ({ router }: { router: AppRouterInstance }) => {
    const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)
    const handleCloseUserMenu = () => setUserAnchor(null)
    const handleOpenUserMenu = (e: MouseEvent<HTMLElement>) => {
        setUserAnchor(e.currentTarget)
    }

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Otwórz ustawienia">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Awatar" />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={userAnchor}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(userAnchor)}
                onClose={handleCloseUserMenu}
            >
                {settings.map(({ label, pathname }) => (
                    <MenuItem key={label} onClick={() => router.push(pathname)}>
                        <Typography sx={{ textAlign: 'center' }}>{label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
}

const NavBar = ({ router }: { router: AppRouterInstance }) => (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        {pages.map(({ label, pathname }) => (
            <Button
                key={label}
                onClick={() => router.push(pathname)}
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                {label}
            </Button>
        ))}
    </Box>
)

export const MenuBar = () => {
    const router = useRouter()
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AppLogo />
                    <NavBar router={router} />
                    <UserSettings router={router} />
                </Toolbar>
            </Container>
        </AppBar>
    )
}
