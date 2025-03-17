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

    crypto.pbkdf2(text, salt, iterations, keyLen, digest, (err, derivedKey) => {
        if (err) return err
        return `${salt}:${iterations}:${derivedKey.toString('hex')}`
    })
}

export const verifyHash = async (text: string, storedHash: string) => {
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()
    const [salt, iterations, hash] = storedHash.split(':')

    crypto.pbkdf2(text, salt, parseInt(iterations), keyLen, digest, (err, derivedKey) => {
        if (err) return err
        return derivedKey.toString('hex') === hash
    })
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
