'use client'

import { AuthProvider, SignInPage } from '@toolpad/core'
import { signIn } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { createUser } from '@/services/userService'
import { setSession } from '@/utils/session'
import {
    CustomEmailLoginField,
    CustomLoginField,
    CustomPasswordField,
    SignInLink,
    SignUpLink,
} from '@/app/(auth)/Fields'

const providers = [{ id: 'credentials', name: 'Email and Password' }]

const LoginRegister = ({ authAction }: { authAction: 'login' | 'register' }) => {
    const router = useRouter()

    const signInHandler = async (_provider: AuthProvider, formData: FormData) => {
        const login = formData.get('login')?.toString() ?? ''
        const password = formData.get('password')?.toString() ?? ''

        try {
            const sessionId = await signIn({
                login,
                password,
            })
            setSession({
                sessionId,
                login,
            })
        } catch (e) {
            if (e instanceof Error) {
                return {
                    type: 'error',
                    error: e.message,
                }
            } else {
                return {
                    type: 'error',
                    error: 'Nieznany błąd',
                }
            }
        }
        router.push('/')
        return {}
    }

    const signUpHandler = async (_provider: AuthProvider, formData: FormData) => {
        try {
            await createUser({
                login: formData.get('login')?.toString() ?? '',
                email: formData.get('email')?.toString() ?? '',
                keepBaseIngredients: true,
                password: formData.get('password')?.toString() ?? '',
            })
            await signInHandler(_provider, formData)
        } catch (e) {
            if (e instanceof Error) {
                return {
                    type: 'error',
                    error: e.message,
                }
            }
        }
        return {}
    }

    if (authAction === 'login') {
        return (
            <SignInPage
                signIn={signInHandler}
                providers={providers}
                slots={{
                    signUpLink: SignUpLink,
                    emailField: CustomLoginField,
                    passwordField: CustomPasswordField,
                }}
                slotProps={{ form: { noValidate: true } }}
                localeText={{
                    signInTitle: 'Zaloguj się',
                    signInSubtitle: 'Witaj użytkowniku, zaloguj się aby kontynuować',
                    signInRememberMe: 'Pamiętaj mnie',
                }}
            />
        )
    } else {
        return (
            <SignInPage
                signIn={signUpHandler}
                providers={providers}
                slots={{
                    signUpLink: SignInLink,
                    emailField: CustomEmailLoginField,
                    passwordField: CustomPasswordField,
                    rememberMe: () => <></>,
                }}
                slotProps={{ form: { noValidate: true } }}
                localeText={{
                    signInTitle: 'Zarejestruj się',
                    signInSubtitle: 'Podaj wymagane dane, aby założyć konto',
                }}
            />
        )
    }
}

export default LoginRegister
