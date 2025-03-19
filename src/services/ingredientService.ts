'use server'
import { Session } from '@/types/Auth'
import { CreateIngredientDTO, Ingredient, PatchIngredientDTO } from '@/types/Ingredients'
import { verifySession } from '@/utils/auth'
import { getFromFile, setToFile } from '@/utils/file'
import { randomUUID, UUID } from 'crypto'

import { join } from 'path'

export const createIngredient = async (
    { name, type, cost, conversion, kcal }: CreateIngredientDTO,
    session: Session
) => {
    const ingredientId = randomUUID()
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'ingredients.json'
    )

    const ingredient: Ingredient = {
        id: ingredientId,
        name,
        type,
        cost,
        conversion,
        kcal,
    }
    const ingredients = await getIngredients(session)
    const newIngredients = [...ingredients, ingredient]

    const verification = await verifySession(session)
    if (verification) {
        await setToFile(filePath, newIngredients)
        return true
    }
    throw new Error('Session is invalid')
}

export const getIngredients = async (session: Session) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'ingredients.json'
    )
    const ingredients: Ingredient[] = await getFromFile(filePath)
    const verification = await verifySession(session)
    if (verification) {
        return ingredients
    }
    throw new Error('Session is invalid')
}

export const deleteIngredient = async (id: UUID, session: Session) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'ingredients.json'
    )
    const ingredients = await getIngredients(session)
    const newIngredients = ingredients.filter((ingredient) => ingredient.id !== id)
    await setToFile(filePath, newIngredients)
    return true
}

export const patchIngredient = async (
    { id, name, type, cost, conversion, kcal }: PatchIngredientDTO,
    session: Session
) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'ingredients.json'
    )
    const ingredients = await getIngredients(session)
    const unchangedIngredients = ingredients.filter((ingredient) => ingredient.id !== id)
    const toPatchIngredient = ingredients.find((ingredient) => ingredient.id === id)
    if (!toPatchIngredient) {
        throw new Error(`Ingredient with id: ${id} does not exist`)
    }

    toPatchIngredient.name = name ?? toPatchIngredient.name
    toPatchIngredient.type = type ?? toPatchIngredient.type
    toPatchIngredient.cost = cost ?? toPatchIngredient.cost
    toPatchIngredient.conversion = conversion ?? toPatchIngredient.conversion
    toPatchIngredient.kcal = kcal ?? toPatchIngredient.kcal

    const newIngredients = [...unchangedIngredients, toPatchIngredient]
    await setToFile(filePath, newIngredients)
    return true
}
