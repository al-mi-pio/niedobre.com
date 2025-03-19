'use server'
import get from '@/utils/config'
import crypto from 'crypto'
import { join } from 'path'
import { User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile } from './file'

export const hashString = async (text: string) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const iterations = get.hashIterations()
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()

    return [
        salt,
        iterations,
        crypto.pbkdf2Sync(text, salt, iterations, keyLen, digest).toString('hex'),
    ].join(':')
}
export const verifyHash = async (text: string, storedHash: string) => {
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()
    const [salt, iterations, hash] = storedHash.split(':')

    const hashedText = crypto
        .pbkdf2Sync(text, salt, parseInt(iterations), keyLen, digest)
        .toString('hex')

    return hashedText === hash
}

export const verifySession = async ({ sessionId, login }: Session) => {
    if (!login) {
        throw new Error('No session found')
    }
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        throw new Error(`User with login: ${login} does not exist`)
    }

    return user.sessionId == sessionId
}
