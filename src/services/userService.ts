'use server'
import { hashString, verifySession } from '@/utils/auth'
import { randomUUID } from 'crypto'
import { join } from 'path'
import fs from 'fs'
import { CreateUserDTO, PatchUserDTO, User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile, setToFile } from '@/utils/file'
import { baseIngredients } from '@/constants/baseIngredients'
import { DataError } from '@/errors/dataError'
import { emailValidation, loginValidation, passwordValidation } from '@/utils/validate'

export const createUser = async ({ login, password, email }: CreateUserDTO) => {
    const userId = randomUUID()
    const folderPath = join(process.cwd(), 'src', 'data', 'users', login)
    const hashedPassword = await hashString(password)
    if (!loginValidation(login)) {
        throw new DataError(`Błędny login`)
    }
    if (email && !emailValidation(email)) {
        throw new DataError('Błędny email')
    }
    if (!passwordValidation(password)) {
        throw new DataError(
            'Hasło musi zawierać: przynajmniej 8 liter, duża literę, małą literę oraz liczbę'
        )
    }
    const user: User = {
        id: userId,
        login,
        email,
        password: hashedPassword,
    }

    fs.mkdirSync(folderPath, { recursive: true })
    const userFilePath = join(folderPath, 'user.json')
    if (fs.existsSync(userFilePath)) {
        throw new DataError(`Użytkownik z loginem ${login} już istnieje`)
    }
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
        throw new DataError(`Użytkownik z loginem ${session.login} nie istnieje`)
    }

    await verifySession(session)

    return user
}

export const deleteUser = async (session: Session) => {
    const folderPath = join(process.cwd(), 'src', 'data', 'users', session.login)
    await verifySession(session)

    fs.rmdirSync(folderPath, { recursive: true })
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

    await verifySession(session)

    if (login !== undefined) {
        const oldFolderPath = join('src', 'data', 'users', session.login)

        const newFolderPath = join(process.cwd(), 'src', 'data', 'users', login)
        const newFilePath = join(newFolderPath, 'user.json')

        try {
            fs.renameSync(oldFolderPath, newFolderPath)
        } catch {
            throw new DataError(`Użytkownik z loginem ${session.login} już istnieje`)
        }
        filePath = newFilePath
    }
    await setToFile(filePath, user)
}
