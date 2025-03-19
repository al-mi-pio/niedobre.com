'use server'
import { Session, SignInDTO } from '@/types/Auth'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { User } from '@/types/User'
import { verifyHash, verifySession } from '@/utils/auth'

import { patchUser } from '@/services/userService'
import { getFromFile, setToFile } from '@/utils/file'

export const signIn = async ({ login, password }: SignInDTO) => {
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        throw new Error(`User with login: ${login} does not exist`)
    }

    const result = await verifyHash(password, user.password)

    if (result) {
        const sessionId = randomUUID()
        user.sessionId = sessionId
        await setToFile(filePath, user)
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
