'use server'
import get from '@/utils/config'
import crypto from 'crypto'

import path from 'path'
import fs from 'fs'
import { User } from '@/types/User'
import { Session } from '@/types/Auth'

export const hashString = async (text: string) => {
    const salt = crypto.randomBytes(16).toString('hex')
    const iterations = get.hashIterations()
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()

    return crypto.pbkdf2Sync(text, salt, iterations, keyLen, digest).toString('hex')
}
export const verifyHash = async (text: string, storedHash: string) => {
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()
    const [salt, iterations, hash] = storedHash.split(':')

    const unhashed = crypto
        .pbkdf2Sync(text, salt, parseInt(iterations), keyLen, digest)
        .toString('hex')

    return hash === unhashed
}

export const verifySession = async ({ sessionId, login }: Session) => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let data
    try {
        data = fs.readFileSync(filePath, 'utf8')
    } catch {
        throw new Error(`User with login: ${login} does not exist`)
    }
    const user: User = JSON.parse(data)

    return user.sessionId == sessionId
}
