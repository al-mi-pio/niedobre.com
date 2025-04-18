'use server'
import { hashString, verifySession } from '@/utils/auth'
import { randomUUID } from 'crypto'
import { join } from 'path'
import fs from 'fs'
import { CreateUserDTO, PatchUserDTO, User } from '@/types/User'
import { Session } from '@/types/Auth'
import { getFromFile, setToFile } from '@/utils/file'
import { baseIngredients } from '@/constants/baseIngredients'
import { DataError } from '@/errors/DataError'
import { emailValidation, loginValidation, passwordValidation } from '@/utils/validate'
import { ValidationError } from '@/errors/ValidationError'
import { SessionError } from '@/errors/SessionError'

export const createUser = async ({
    login,
    password,
    keepBaseIngredients,
    email,
}: CreateUserDTO) => {
    const userId = randomUUID()
    const folderPath = join(process.cwd(), 'src', 'data', 'users', login)
    const hashedPassword = await hashString(password)
    if (!loginValidation(login)) {
        return new ValidationError('Błędny login', {})
    }
    if (email && !emailValidation(email)) {
        return new ValidationError('Błędny email', {})
    }
    if (!passwordValidation(password)) {
        return new ValidationError(
            'Hasło musi zawierać: przynajmniej 8 liter, duża literę, małą literę oraz liczbę',
            {}
        )
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
        return new DataError(`Użytkownik z loginem ${login} już istnieje`)
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
        return new DataError(`Użytkownik z loginem ${session.login} nie istnieje`)
    }

    const verifiedSession = await verifySession(session)
    if (verifiedSession instanceof SessionError) {
        return verifiedSession
    }

    return user
}

export const deleteUser = async (session: Session) => {
    const folderPath = join(process.cwd(), 'src', 'data', 'users', session.login)
    const verifiedSession = await verifySession(session)
    if (verifiedSession instanceof SessionError) {
        return verifiedSession
    }

    fs.rmdirSync(folderPath, { recursive: true })
}

export const patchUser = async (
    { login, password, email, sessionId }: PatchUserDTO,
    session: Session
) => {
    let filePath = join(process.cwd(), 'src', 'data', 'users', session.login, 'user.json')

    const user = await getUser(session)
    if (user instanceof SessionError || user instanceof DataError) {
        return user
    }

    user.login = login ?? user.login
    user.email = email ?? user.email

    if (password !== undefined) {
        if (!passwordValidation(password)) {
            return new ValidationError(
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
    if (verifiedSession instanceof SessionError) {
        return verifiedSession
    }

    if (login !== undefined) {
        const oldFolderPath = join('src', 'data', 'users', session.login)

        const newFolderPath = join(process.cwd(), 'src', 'data', 'users', login)
        const newFilePath = join(newFolderPath, 'user.json')

        try {
            fs.renameSync(oldFolderPath, newFolderPath)
        } catch {
            return new DataError(`Użytkownik z loginem ${session.login} już istnieje`)
        }
        filePath = newFilePath
    }
    await setToFile(filePath, user)
}
