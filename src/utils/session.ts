'use client'

import { sessionError } from '@/errors/SessionError'
import { Session } from '@/types/Auth'
import { UUID } from 'crypto'

export const getSession = () => {
    const sessionId = localStorage.getItem('session_id')
    const login = localStorage.getItem('user_login')
    if (sessionId == null || login == null) {
        return sessionError('Brak sesji')
    }
    return {
        sessionId: sessionId as UUID,
        login,
    } as Session
}

export const setSession = ({ sessionId, login }: Session) => {
    localStorage.setItem('session_id', sessionId)
    localStorage.setItem('user_login', login)
}

export const removeSession = () => {
    localStorage.removeItem('session_id')
    localStorage.removeItem('user_login')
}
