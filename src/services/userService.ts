'use server'
import { hashString, verifySession } from '@/utils/auth'
import { randomUUID } from 'crypto'
import { join } from 'path'
import fs from 'fs'
import { CreateUserDTO, PatchUserDTO, User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile, setToFile } from '@/utils/file'
import { baseIngredients } from '@/constants/baseIngredients'

export const createUser = async ({ login, password, email }: CreateUserDTO) => {
    const userId = randomUUID()
    const folderPath = join(process.cwd(), 'src', 'data', 'users', login)
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
    const userFilePath = join(folderPath, 'user.json')
    await setToFile(userFilePath, user)
    const ingredientFilePath = join(folderPath, 'ingredients.json')
    const baseIngredientsToInsert = baseIngredients.map((ingredient) => ({
        id: randomUUID(),
        name: ingredient.name,
        type: ingredient.type,
        conversion: ingredient.conversion,
        kcal: ingredient.kcal,
    }))
    await setToFile(ingredientFilePath, baseIngredientsToInsert)
    const recipeFilePath = join(folderPath, 'recipes.json')
    await setToFile(recipeFilePath, [])

    return true
}

export const getUser = async (session: Session) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'user.json'
    )
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        throw new Error(`User with login: ${session.login} does not exist`)
    }

    const verification = await verifySession(session)

    if (verification) {
        return user
    }
    throw new Error('Session is invalid')
}

export const deleteUser = async (session: Session) => {
    const folderPath = join(process.cwd(), 'src', 'data', 'users', session.login)
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
    let filePath = join(process.cwd(), 'src', 'data', 'users', session.login, 'user.json')

    const user: User = await getUser(session)
    user.login = login ?? user.login
    user.email = email ?? user.email

    if (password !== undefined) {
        const hashedPassowrd = await hashString(password)
        user.password = hashedPassowrd
    }

    if (sessionId !== undefined) {
        user.sessionId = sessionId
    }

    const verification = await verifySession(session)

    if (verification) {
        if (login !== undefined) {
            const oldFolderPath = join('src', 'data', 'users', session.login)

            const newFolderPath = join(process.cwd(), 'src', 'data', 'users', login)
            const newFilePath = join(newFolderPath, 'user.json')

            try {
                fs.renameSync(oldFolderPath, newFolderPath)
            } catch {
                throw new Error(`User with login: ${login} already exists`)
            }
            filePath = newFilePath
        }
        await setToFile(filePath, user)
        return true
    }
    throw new Error('Session is invalid')
}
