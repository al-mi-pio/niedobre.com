'use client'

import LoginRegister from '@/app/(auth)/LoginRegisterPage'
import { setSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { signIn } from '@/services/authService'
import { AuthProvider } from '@toolpad/core'

const Login = () => {
    const router = useRouter()

    const signInHandler = async (_provider: AuthProvider, formData: FormData) => {
        const login = formData.get('login')?.toString() ?? ''
        const password = formData.get('password')?.toString() ?? ''

        const sessionId = await signIn({
            login,
            password,
        })

        if (typeof sessionId === 'object') {
            return sessionId
        }

        setSession({
            sessionId,
            login,
        })

        router.push('/')
        return {}
    }

    return <LoginRegister authAction={'login'} actionHandler={signInHandler} />
}

export default Login
