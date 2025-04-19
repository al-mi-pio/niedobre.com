'use server'
import get from '@/utils/config'
import crypto from 'crypto'
import { join } from 'path'
import { User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile } from './file'
import { SessionError } from '@/errors/SessionError'

export const hashString = async (text: string) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const iterations = get.hashIterations()
    const keyLen = get.keyLength()
    const digest = get.hashAlgorithm()

    return [
        salt,
        iterations,
        crypto.pbkdf2Sync(text, salt, iterations, keyLen, digest).toString('hex'),
    ].join(':')
}
export const verifyHash = async (text: string, storedHash: string) => {
    const keyLen = get.keyLength()
    const digest = get.hashAlgorithm()
    const [salt, iterations, hash] = storedHash.split(':')

    const hashedText = crypto
        .pbkdf2Sync(text, salt, parseInt(iterations), keyLen, digest)
        .toString('hex')

    return hashedText === hash
}

export const verifySession = async ({ sessionId, login }: Session) => {
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        return new SessionError(`Użytkownik z loginem ${login} nie istnieje`)
    }

    if (user.sessionId !== sessionId) {
        return new SessionError('Nieprawidłowa sesja')
    }
    return {}
}
