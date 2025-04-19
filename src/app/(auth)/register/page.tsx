'use client'

import LoginRegister from '@/app/(auth)/LoginRegisterPage'
import { createUser } from '@/services/userService'
import { setSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { signIn } from '@/services/authService'
import { AuthProvider } from '@toolpad/core'
import { unknownErrorMessage } from '@/constants/general'

const Register = () => {
    const router = useRouter()

    const signUpHandler = async (_provider: AuthProvider, formData: FormData) => {
        try {
            const login = formData.get('login')?.toString() ?? ''
            const password = formData.get('password')?.toString() ?? ''
            const user = await createUser({
                login,
                email: formData.get('email')?.toString() ?? '',
                keepBaseIngredients: !!formData.get('ingredients'),
                password,
            })
            if (user instanceof Error) {
                return {
                    type: 'error',
                    error: user.message,
                }
            }
            const sessionId = await signIn({
                login,
                password,
            })
            if (sessionId instanceof Error) {
                return {
                    type: 'error',
                    error: sessionId.message,
                }
            }
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

    return <LoginRegister authAction={'register'} actionHandler={signUpHandler} />
}

export default Register
