'use server'
import { authRateLimit, hashString, verifySession } from '@/utils/auth'
import { randomUUID } from 'crypto'
import { join } from 'path'
import fs from 'fs'
import { CreateUserDTO, PatchUserDTO, User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile, setToFile } from '@/utils/file'
import { baseIngredients } from '@/constants/baseIngredients'
import { dataError } from '@/errors/DataError'
import { emailValidation, loginValidation, passwordValidation } from '@/utils/validate'
import { validationError } from '@/errors/ValidationError'
import { Success } from '@/types/default'

export const createUser = async ({
    login,
    password,
    keepBaseIngredients,
    email,
}: CreateUserDTO) => {
    const rateLimited = await authRateLimit()
    if (rateLimited) {
        return rateLimited
    }
    const userId = randomUUID()
    const folderPath = join(process.cwd(), 'src', 'data', 'users', login)
    const hashedPassword = await hashString(password)
    if (!loginValidation(login)) {
        return {
            type: 'error',
            error: 'Błędny login',
        }
    }
    if (email && !emailValidation(email)) {
        return {
            type: 'error',
            error: 'Błędny email',
        }
    }
    if (!passwordValidation(password)) {
        return {
            type: 'error',
            error: 'Hasło musi zawierać: przynajmniej 8 liter, duża literę, małą literę oraz liczbę',
        }
    }
    const user: User = {
        id: userId,
        login,
        email,
        password: hashedPassword,
        passwordReset: null,
    }

    fs.mkdirSync(folderPath, { recursive: true })
    const userFilePath = join(folderPath, 'user.json')
    if (fs.existsSync(userFilePath)) {
        return {
            type: 'error',
            error: `Użytkownik z loginem ${login} już istnieje`,
        }
    }
    await setToFile(userFilePath, user)
    const ingredientFilePath = join(folderPath, 'ingredients.json')
    if (keepBaseIngredients) {
        const baseIngredientsToInsert = baseIngredients.map((ingredient) => ({
            id: randomUUID(),
            name: ingredient.name,
            type: ingredient.type,
            conversion: ingredient.conversion,
            foodGroup: ingredient.foodGroup,
            kcal: ingredient.kcal,
            protein: ingredient.protein,
            fat: ingredient.fat,
            carbohydrates: ingredient.carbohydrates,
            salt: ingredient.salt,
        }))
        await setToFile(ingredientFilePath, baseIngredientsToInsert)
    } else {
        await setToFile(ingredientFilePath, [])
    }
    const recipeFilePath = join(folderPath, 'recipes.json')
    await setToFile(recipeFilePath, [])
    return { type: undefined, error: undefined }
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
        return dataError(`Użytkownik z loginem ${session.login} nie istnieje`)
    }

    const verifiedSession = await verifySession(session)
    if ('errorType' in verifiedSession) {
        return verifiedSession
    }

    return user
}

export const deleteUser = async (session: Session) => {
    const folderPath = join(process.cwd(), 'src', 'data', 'users', session.login)
    const verifiedSession = await verifySession(session)
    if ('errorType' in verifiedSession) {
        return verifiedSession
    }

    fs.rmSync(folderPath, { recursive: true })
    return [] as Success
}

export const patchUser = async (
    { login, password, email, sessionId }: PatchUserDTO,
    session: Session
) => {
    let filePath = join(process.cwd(), 'src', 'data', 'users', session.login, 'user.json')

    const user = await getUser(session)
    if ('errorType' in user) {
        return user
    }

    user.login = login ?? user.login
    user.email = email ?? user.email

    if (password !== undefined) {
        if (!passwordValidation(password)) {
            return validationError(
                'Hasło musi zawierać: przynajmniej 8 liter, duża literę, małą literę oraz liczbę',
                {}
            )
        }
        user.password = await hashString(password)
    }

    if (sessionId !== undefined) {
        user.sessionId = sessionId
    }

    const verifiedSession = await verifySession(session)
    if ('errorType' in verifiedSession) {
        return verifiedSession
    }

    if (login !== undefined) {
        const oldFolderPath = join('src', 'data', 'users', session.login)

        const newFolderPath = join(process.cwd(), 'src', 'data', 'users', login)
        const newFilePath = join(newFolderPath, 'user.json')

        try {
            fs.renameSync(oldFolderPath, newFolderPath)
        } catch {
            return dataError(`Użytkownik z loginem ${session.login} już istnieje`)
        }
        filePath = newFilePath
    }
    await setToFile(filePath, user)
    return [] as Success
}
