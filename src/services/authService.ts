'use server'
import { Session, SignInDTO } from '@/types/Auth'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { User } from '@/types/User'
import { verifyHash, verifySession } from '@/utils/auth'
import { DataError } from '@/errors/DataError'
import { patchUser } from '@/services/userService'
import { getFromFile, setToFile } from '@/utils/file'

export const signIn = async ({ login, password }: SignInDTO) => {
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        throw new DataError(`Użytkownik z loginem ${login} nie istnieje`)
    }

    const result = await verifyHash(password, user.password)

    if (result) {
        const sessionId = randomUUID()
        user.sessionId = sessionId
        await setToFile(filePath, user)
        return sessionId
    }
    throw new DataError('Hasło jest nieprawidłowe')
}

export const signOut = async (session: Session) => {
    await verifySession(session)
    patchUser({ sessionId: null }, session)
}
