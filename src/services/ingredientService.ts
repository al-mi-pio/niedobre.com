'use server'
import { dataError } from '@/errors/DataError'

import { Session } from '@/types/Auth'
import { Success } from '@/types/default'
import { CreateIngredientDTO, Ingredient, PatchIngredientDTO } from '@/types/Ingredient'
import { verifySession } from '@/utils/auth'
import { getFromFile, setToFile } from '@/utils/file'
import { randomUUID, UUID } from 'crypto'

import { join } from 'path'

export const createIngredient = async (
    {
        name,
        type,
        cost,
        conversion,
        kcal,
        foodGroup,
        fat,
        protein,
        carbohydrates,
        salt,
    }: CreateIngredientDTO,
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
        foodGroup: foodGroup ?? 'inne',
        salt,
        carbohydrates,
        fat,
        protein,
    }
    const ingredients = await getIngredients(session)
    if ('errorType' in ingredients) {
        return ingredients
    }
    const newIngredients = [...ingredients, ingredient]

    await setToFile(filePath, newIngredients)
    return [] as Success
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

    const verifiedSession = await verifySession(session)
    if ('errorType' in verifiedSession) {
        return verifiedSession
    }

    const ingredients: Ingredient[] = await getFromFile(filePath)
    return ingredients
}

export const getIngredientById = async (id: UUID, session: Session) => {
    const ingredients = await getIngredients(session)
    if ('errorType' in ingredients) {
        return ingredients
    }
    const ingredient = ingredients.find((ingredient) => ingredient.id === id)
    if (ingredient === undefined) {
        return dataError(`Składnik z id ${id} nie istnieje`)
    }
    return ingredient
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
    if ('errorType' in ingredients) {
        return ingredients
    }
    const newIngredients = ingredients.filter((ingredient) => ingredient.id !== id)
    await setToFile(filePath, newIngredients)
}

export const patchIngredient = async (
    {
        id,
        name,
        type,
        cost,
        conversion,
        kcal,
        foodGroup,
        fat,
        protein,
        carbohydrates,
        salt,
    }: PatchIngredientDTO,
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
    if ('errorType' in ingredients) {
        return ingredients
    }
    const unchangedIngredients = ingredients.filter((ingredient) => ingredient.id !== id)
    const toPatchIngredient = ingredients.find((ingredient) => ingredient.id === id)
    if (!toPatchIngredient) {
        return dataError(`Składnik z id ${id} nie istnieje`)
    }

    toPatchIngredient.name = name ?? toPatchIngredient.name
    toPatchIngredient.type = type ?? toPatchIngredient.type
    toPatchIngredient.cost = cost
    toPatchIngredient.conversion = conversion
    toPatchIngredient.kcal = kcal
    toPatchIngredient.foodGroup = foodGroup ?? toPatchIngredient.foodGroup
    toPatchIngredient.carbohydrates = carbohydrates
    toPatchIngredient.salt = salt
    toPatchIngredient.fat = fat
    toPatchIngredient.protein = protein

    const newIngredients = [...unchangedIngredients, toPatchIngredient]
    await setToFile(filePath, newIngredients)
    return [] as Success
}
