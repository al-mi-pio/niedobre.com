'use client'

import LoginRegister from '@/app/(auth)/LoginRegisterPage'
import { setSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { signIn } from '@/services/authService'
import { AuthProvider } from '@toolpad/core'
import { unknownErrorMessage } from '@/constants/general'

const Login = () => {
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
                    error: unknownErrorMessage,
                }
            }
        }
        router.push('/')
        return {}
    }

    return <LoginRegister authAction={'login'} actionHandler={signInHandler} />
}

export default Login
