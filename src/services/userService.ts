'use server'
import { hashString, verifySession } from '@/utils/auth'
import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import { CreateUserDTO, PatchUserDTO, User } from '@/types/User'
import { Session } from '@/types/Auth'

export const createUser = async ({ login, password, email }: CreateUserDTO) => {
    const userId = randomUUID()
    const folderPath = path.join(process.cwd(), 'src', 'data', 'users', login)
    const hashedPassword = await hashString(password)

    const user: User = {
        id: userId,
        login,
        email,
        password: hashedPassword,
    }
    try {
        fs.mkdirSync(folderPath)
    } catch {
        throw new Error(`User with login: ${login} already exists`)
    }
    const filePath = path.join(folderPath, 'user.json')
    fs.writeFileSync(filePath, JSON.stringify(user, null, 2), 'utf8')

    return true
}

export const getUser = async (session: Session) => {
    const filePath = path.join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'user.json'
    )
    let data
    try {
        data = fs.readFileSync(filePath, 'utf8')
    } catch {
        throw new Error(`User with login: ${session.login} does not exist`)
    }
    const user: User = JSON.parse(data)
    const verification = await verifySession(session)

    if (verification) {
        return user
    }
    throw new Error('Session is invalid')
}

export const deleteUser = async (session: Session) => {
    const folderPath = path.join(process.cwd(), 'src', 'data', 'users', session.login)
    const verification = await verifySession(session)

    if (verification) {
        fs.rmdirSync(folderPath, { recursive: true })
        return true
    }
    throw new Error('Session is invalid')
}

export const patchUser = async (
    { login, password, email, sessionId }: PatchUserDTO,
    session: Session
) => {
    let filePath = path.join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'user.json'
    )

    const user: User = await getUser(session)

    if (login !== undefined) {
        user.login = login
        const oldFolderPath = path.join('src', 'data', 'users', session.login)

        const newFolderPath = path.join(process.cwd(), 'src', 'data', 'users', login)
        const newFilePath = path.join(newFolderPath, 'user.json')

        try {
            fs.renameSync(oldFolderPath, newFolderPath)
        } catch {
            throw new Error(`User with login: ${login} already exists`)
        }
        filePath = newFilePath
    }

    if (password !== undefined) {
        const hashedPassowrd = await hashString(password)
        user.password = hashedPassowrd
    }

    if (email !== undefined) {
        user.email = email
    }

    if (sessionId !== undefined) {
        user.sessionId = sessionId
    }

    const verification = await verifySession(session)

    if (verification) {
        fs.writeFileSync(filePath, JSON.stringify(user, null, 2), 'utf8')
        return true
    }
    throw new Error('Session is invalid')
}
