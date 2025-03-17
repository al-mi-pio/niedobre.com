'use server'
import { Session, SignInDTO } from '@/types/Auth'
import path from 'path'
import fs from 'fs'
import { randomUUID, UUID } from 'crypto'
import { User } from '@/types/User'
import { verifyHash, verifySession } from '@/utils/auth'

import { patchUser } from './userService'

export const signIn = async ({ login, password }: SignInDTO): Promise<UUID> => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let data
    try {
        data = fs.readFileSync(filePath, 'utf8')
    } catch {
        throw new Error('User with login: ' + login + ' does not exist')
    }
    const user: User = JSON.parse(data)
    const result = await verifyHash(password, user.password)
    return new Promise((resolve, reject) => {
        if (result) {
            const sessionId = randomUUID()
            user.sessionId = sessionId
            fs.writeFileSync(filePath, JSON.stringify(user, null, 2), 'utf8')
            resolve(sessionId)
        }
        reject('Password is incorrect')
    })
}

export const singOut = async (session: Session): Promise<boolean> => {
    const verification = await verifySession(session)
    return new Promise((resolve, reject) => {
        if (verification) {
            patchUser({ sessionId: null }, session)
            resolve(true)
        } else {
            reject('Session is invalid')
        }
    })
}
