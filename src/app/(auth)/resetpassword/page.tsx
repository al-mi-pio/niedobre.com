'use client'

import LoginRegister from '@/app/(auth)/LoginRegisterPage'
import { Spinner } from '@/components/Spinner'
import { passwordValidation } from '@/utils/validate'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { changePassword, resetPasswordRequest } from '@/services/authService'
import { emptyUUID, unknownErrorMessage } from '@/constants/general'
import { AuthProvider, AuthResponse } from '@toolpad/core'
import { ValidationError } from '@/errors/ValidationError'
import { UUID } from 'crypto'

const providers = [{ id: 'nodemailer', name: 'Email' }]

const validatePasswords = (password?: string, secondPassword?: string) => {
    if (!password || !secondPassword) {
        throw new ValidationError('Pola nie mogą być puste', {})
    }

    if (password !== secondPassword) {
        throw new ValidationError('Hasła muszą być identyczne', {})
    }

    if (!passwordValidation(password)) {
        throw new ValidationError(
            'Hasło musi zawierać: przynajmniej 8 liter, duża literę, małą literę oraz liczbę',
            {}
        )
    }

    return password
}

const ResetPassword = () => {
    const [loading, setLoading] = useState(true)
    const [pending, setPending] = useState(false)
    const [isRequesting, setIsRequesting] = useState(false)
    const router = useRouter()
    const params = useSearchParams()
    const token = params.get('token')
    const login = params.get('login')

    const changePasswordHandler = async (_provider: AuthProvider, formData: FormData) => {
        try {
            const password = validatePasswords(
                formData.get('password')?.toString(),
                formData.get('repeatPassword')?.toString()
            )
            const passwordChanged = await changePassword(
                login ?? '',
                token ? (token as UUID) : emptyUUID,
                password
            )

            if (passwordChanged.error) {
                return passwordChanged
            }
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

        router.push('/login?reason=passwordChanged')
        return {}
    }

    const changePasswordRequestHandler = async (
        _provider: AuthProvider,
        formData: FormData
    ): Promise<AuthResponse> => {
        setPending(true)
        try {
            const request = await resetPasswordRequest(
                formData.get('login')?.toString() ?? '',
                window.location.origin
            )
            setPending(false)
            if (request.error) {
                return request
            }
        } catch (e) {
            setPending(false)
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
        return {
            success: 'Email został wysłany',
        }
    }

    useEffect(() => {
        if (!login || !token) {
            setIsRequesting(true)
        }
        setLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loading ? (
        <Spinner />
    ) : isRequesting ? (
        <LoginRegister
            authAction="requestPasswordChange"
            actionHandler={changePasswordRequestHandler}
            providers={providers}
            pending={pending}
        />
    ) : (
        <LoginRegister
            authAction="changePassword"
            actionHandler={changePasswordHandler}
        />
    )
}

export default ResetPassword
