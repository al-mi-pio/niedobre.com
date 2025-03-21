'use client'

import { AuthProvider, SignInPage } from '@toolpad/core'
import { signIn } from '@/services/authService'
import { useRouter } from 'next/navigation'

const providers = [{ id: 'credentials', name: 'Email and Password' }]

const Login = () => {
    const router = useRouter()

    const signInHandler = async (_provider: AuthProvider, formData: FormData) => {
        try {
            const session = await signIn({
                login: formData.get('email')?.toString() ?? '',
                password: formData.get('password')?.toString() ?? '',
            })
        } catch (e) {
            if (e instanceof Error) {
                return {
                    type: 'error',
                    error: e.message,
                }
            }
        }
        router.push('/')
        return {}
    }

    return (
        <SignInPage
            signIn={signInHandler}
            providers={providers}
            slotProps={{ form: { noValidate: true } }}
            localeText={{
                signInTitle: 'Zaloguj się',
                signInSubtitle: 'Witaj użytkowniku, zaloguj się aby kontynuować',
                signInRememberMe: 'Pamiętaj mnie',
                email: 'Login',
                password: 'Hasło',
            }}
        />
    )
}

export default Login
