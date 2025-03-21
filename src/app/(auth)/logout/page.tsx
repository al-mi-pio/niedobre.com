'use client'

import { getSession, removeSession } from '@/utils/session'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Spinner'
import { singOut } from '@/services/authService'

const handleLogout = async () => {
    const session = getSession()
    removeSession()
    await singOut(session)
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
