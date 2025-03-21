'use client'

import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { getUser } from '@/services/userService'
import { User } from '@/types/User'
import {
    SetStateAction,
    ReactNode,
    Dispatch,
    createContext,
    useEffect,
    useState,
} from 'react'
import { Spinner } from '@/components/Spinner'

const handleAuthentication = async (setUser: Dispatch<SetStateAction<User | null>>) => {
    const session = getSession()
    const user = await getUser(session)
    setUser(() => user)
}

export const AuthContext = createContext<User | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        handleAuthentication(setUser).catch(() => router.push('/login'))
    }, [router])

    if (!user) {
        return <Spinner />
    }

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
