import { TextField } from '@mui/material'
import Link from 'next/link'

export const SignUpLink = () => <Link href="/register">{'Zarejestruj się'}</Link>
export const SignInLink = () => <Link href="/login">{'Zaloguj się'}</Link>

export const CustomLoginField = () => (
    <TextField
        label="Login"
        name="login"
        type="text"
        size="small"
        required
        fullWidth
        variant="outlined"
    />
)

export const CustomEmailLoginField = () => (
    <>
        <TextField
            label="Email"
            name="email"
            type="email"
            size="small"
            fullWidth
            variant="outlined"
        />
        <CustomLoginField />
    </>
)

export const CustomPasswordField = () => (
    <TextField
        label="Hasło"
        name="password"
        type="password"
        size="small"
        required
        fullWidth
        variant="outlined"
    />
)
