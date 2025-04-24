'use client'

import { sessionError } from '@/errors/SessionError'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { getUser } from '@/services/userService'
import { Spinner } from '@/components/Spinner'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { User } from '@/types/User'

const handleAuthentication = async () => {
    try {
        const session = getSession()
        if ('errorType' in session) {
            return session
        }
        return await getUser(session)
    } catch {
        return sessionError('Brak sesji')
    }
}

export const AuthContext = createContext<User | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        handleAuthentication().then((res) => {
            if ('errorType' in res) router.push('/login')
            else setUser(res)
        })
    }, [router])

    if (!user) {
        return <Spinner />
    }

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
