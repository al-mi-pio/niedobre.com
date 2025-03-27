'use client'

import { SessionError } from '@/errors/sessionError'
import { Session } from '@/types/Auth'
import { UUID } from 'crypto'

export const getSession = (): Session => {
    const sessionId = localStorage.getItem('session_id')
    const login = localStorage.getItem('user_login')
    if (sessionId == null || login == null) {
        throw new SessionError('Brak sesji')
    }
    return {
        sessionId: sessionId as UUID,
        login,
    }
}

export const setSession = ({ sessionId, login }: Session) => {
    localStorage.setItem('session_id', sessionId)
    localStorage.setItem('user_login', login)
}

export const removeSession = () => {
    localStorage.removeItem('session_id')
    localStorage.removeItem('user_login')
}
