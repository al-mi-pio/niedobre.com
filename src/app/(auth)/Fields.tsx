import { Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material'
import Link from 'next/link'

export const SignUpLink = () => <Link href="/register">{'Zarejestruj się'}</Link>
export const SignInLink = () => <Link href="/login">{'Zaloguj się'}</Link>
export const ForgotPasswordLink = () => (
    <Link href="/resetpassword">{'Nie pamiętam hasła'}</Link>
)

export const CustomSubmitButton = ({ loading }: { loading?: boolean }) => {
    return (
        <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ my: 3 }}
            loading={loading}
        >
            <Typography variant="body2">{'Wyślij'}</Typography>
        </Button>
    )
}

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

export const BaseIngredientsCheckbox = () => (
    <FormControlLabel
        control={<Checkbox name="ingredients" size="small" defaultChecked />}
        label="Dodaj podstawowy zestaw składników"
    />
)

export const RememberMeCheckbox = () => (
    <FormControlLabel
        control={<Checkbox name="remember" size="small" />}
        label="Pamiętaj mnie"
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

export const CustomRepeatPasswordField = () => (
    <TextField
        label="Powtórz hasło"
        name="repeatPassword"
        type="password"
        size="small"
        required
        fullWidth
        variant="outlined"
    />
)
