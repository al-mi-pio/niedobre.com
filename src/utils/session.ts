'use client'

import { Session } from '@/types/Auth'
import { UUID } from 'crypto'

export const getSession = (): Session => {
    const sessionId = localStorage.getItem('session_id')
    const login = localStorage.getItem('user_login')
    if (sessionId == null || login == null) {
        throw new Error('No session found')
    }
    return {
        sessionId: sessionId as UUID,
        login,
    }
}

export const setSession = (userSession: Session) => {
    localStorage.setItem('session_id', userSession.sessionId)
    localStorage.setItem('user_login', userSession.login)
}

export const removeSession = () => {
    localStorage.removeItem('session_id')
    localStorage.removeItem('user_login')
}
