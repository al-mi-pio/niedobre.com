'use server'
import get from '@/utils/config'
import crypto from 'crypto'
import { join } from 'path'
import { User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile } from './file'
import { SessionError, sessionError } from '@/errors/SessionError'
import { Success } from '@/types/default'
import { headers } from 'next/headers'
import { authRateLimiter, rateLimiter } from '@/constants/general'
import { dataError } from '@/errors/DataError'

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
        return sessionError(`Użytkownik z loginem ${login} nie istnieje`) as SessionError
    }

    if (user.sessionId !== sessionId) {
        return sessionError('Nieprawidłowa sesja') as SessionError
    }
    return [] as Success
}

const getIp = async () => {
    const headersList = await headers()
    const xff = headersList.get('x-forwarded-for')
    return xff?.split(',')[0].trim() || 'unknown'
}

export const authRateLimit = async () => {
    const ip = await getIp()
    try {
        await authRateLimiter.consume(ip)
    } catch {
        return {
            type: 'error',
            error: 'Zbyt wiele prób logowania. Spróbuj ponownie później',
        }
    }
}

export const rateLimit = async () => {
    const ip = await getIp()
    try {
        await rateLimiter.consume(ip)
    } catch {
        return dataError('Zbyt wiele akcji. Spróbuj ponownie później')
    }
}
