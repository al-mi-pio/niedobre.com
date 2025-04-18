'use client'

import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { getUser } from '@/services/userService'
import { Spinner } from '@/components/Spinner'
import { ReactNode, createContext, useEffect, useState } from 'react'
import { SessionError } from '@/errors/SessionError'
import { DataError } from '@/errors/DataError'
import { User } from '@/types/User'

const handleAuthentication = async () => {
    try {
        const session = getSession()
        return await getUser(session)
    } catch (error) {
        if (error instanceof SessionError) {
            return error
        }
        return new SessionError('Brak sesji')
    }
}

export const AuthContext = createContext<User | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        handleAuthentication().then((res) => {
            if (res instanceof DataError || res instanceof SessionError)
                router.push('/login')
            else setUser(res)
        })
    }, [router])

    if (!user) {
        return <Spinner />
    }

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
