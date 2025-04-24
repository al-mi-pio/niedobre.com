'use client'

import { getSession, removeSession } from '@/utils/session'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Spinner'
import { signOut } from '@/services/authService'

const handleLogout = async () => {
    const session = getSession()
    removeSession()
    if ('errorType' in session) return

    await signOut(session)
}

const Logout = () => {
    const router = useRouter()

    useEffect(() => {
        handleLogout()
            .catch(() => {})
            .finally(() => router.push('/login'))
    }, [router])

    return <Spinner />
}

export default Logout
