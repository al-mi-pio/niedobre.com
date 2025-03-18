'use server'
import { Session, SignInDTO } from '@/types/Auth'
import path from 'path'
import fs from 'fs'
import { randomUUID } from 'crypto'
import { User } from '@/types/User'
import { verifyHash, verifySession } from '@/utils/auth'

import { patchUser } from './userService'

export const signIn = async ({ login, password }: SignInDTO) => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let data
    try {
        data = fs.readFileSync(filePath, 'utf8')
    } catch {
        throw new Error(`User with login: ${login} does not exist`)
    }
    const user: User = JSON.parse(data)
    const result = await verifyHash(password, user.password)

    if (result) {
        const sessionId = randomUUID()
        user.sessionId = sessionId
        fs.writeFileSync(filePath, JSON.stringify(user, null, 2), 'utf8')
        return sessionId
    }
    throw new Error('Password is incorrect')
}

export const singOut = async (session: Session) => {
    const verification = await verifySession(session)

    if (verification) {
        patchUser({ sessionId: null }, session)
        return true
    } else {
        throw new Error('Session is invalid')
    }
}
