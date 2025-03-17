'use server'
import get from '@/utils/config'
import crypto from 'crypto'

import path from 'path'
import fs from 'fs'
import { User } from '@/types/User'
import { Session } from '@/types/Auth'

export const hashString = async (text: string): Promise<string> => {
    const salt = crypto.randomBytes(16).toString('hex')
    const iterations = get.hashIterations()
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(text, salt, iterations, keyLen, digest, (err, derivedKey) => {
            if (err) reject(err)
            resolve(`${salt}:${iterations}:${derivedKey.toString('hex')}`)
        })
    })
}

export const verifyHash = async (text: string, storedHash: string): Promise<boolean> => {
    const keyLen = get.keyLength()
    const digest = get.hasAlgorithm()
    const [salt, iterations, hash] = storedHash.split(':')
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            text,
            salt,
            parseInt(iterations),
            keyLen,
            digest,
            (err, derivedKey) => {
                if (err) reject(err)
                resolve(derivedKey.toString('hex') === hash)
            }
        )
    })
}

export const verifySession = async ({ sessionId, login }: Session): Promise<boolean> => {
    const filePath = path.join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let data
    try {
        data = fs.readFileSync(filePath, 'utf8')
    } catch {
        throw new Error(`User with login: ${login} does not exist`)
    }
    const user: User = JSON.parse(data)
    return new Promise((resolve) => {
        resolve(user.sessionId == sessionId)
    })
}
