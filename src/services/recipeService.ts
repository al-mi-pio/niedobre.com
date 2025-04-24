'use server'
import { Session } from '@/types/Auth'
import { CreateRecipeDTO, Recipe, PatchRecipeDTO, GetRecipeDTO } from '@/types/Recipe'
import { verifySession } from '@/utils/auth'
import { getFromFile, removeImage, setToFile } from '@/utils/file'
import { randomUUID, UUID } from 'crypto'
import { join } from 'path'
import { getIngredientById } from '@/services/ingredientService'
import { DataError, dataError } from '@/errors/DataError'
import { Success } from '@/types/default'
import { SessionError } from '@/errors/SessionError'

export const createRecipe = async (
    {
        name,
        description,
        instructions,
        pictures,
        ingredients,
        cost,
        publicResources,
    }: CreateRecipeDTO,
    session: Session
) => {
    const recipeId = randomUUID()
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'recipes.json'
    )

    const recipe: Recipe = {
        id: recipeId,
        name,
        description,
        instructions,
        pictures,
        ingredients,
        cost,
        publicResources: publicResources?.length ? publicResources : [],
    }
    const recipes = await getCompressedRecipes(session)
    if ('errorType' in recipes) {
        return recipes
    }
    const newRecipes = [...recipes, recipe]

    await setToFile(filePath, newRecipes)
}

export const getCompressedRecipes = async (session: Session) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'recipes.json'
    )

    const verifiedSession = await verifySession(session)
    if ('errorType' in verifiedSession) {
        return verifiedSession
    }

    const recipes: Recipe[] = await getFromFile(filePath)
    return recipes
}

export const getRecipes = async (session: Session) => {
    const compressedRecipes = await getCompressedRecipes(session)
    if ('errorType' in compressedRecipes) {
        return compressedRecipes
    }
    try {
        const recipes: GetRecipeDTO[] = await Promise.all(
            compressedRecipes.map(async (recipe) => ({
                id: recipe.id,
                name: recipe.name,
                cost: recipe.cost,
                description: recipe.description,
                instructions: recipe.instructions,
                pictures: recipe.pictures,
                ingredients: await Promise.all(
                    recipe.ingredients.map(async (ingredient) => {
                        const fullIngredient = await getIngredientById(
                            ingredient.id,
                            session
                        )
                        if (
                            'errorType' in fullIngredient &&
                            fullIngredient.errorType === 'SessionError'
                        ) {
                            throw fullIngredient
                        }
                        if ('errorType' in fullIngredient) {
                            const recipes = (await getCompressedRecipes(session)) ?? []
                            if ('errorType' in recipes) {
                                throw recipes
                            }
                            const recipe = recipes.find(
                                (recipe) => recipe.id === ingredient.id
                            )
                            if (!recipe) {
                                throw dataError(
                                    `Przepis z id ${ingredient.id} nie istnieje`
                                )
                            }
                            return {
                                ingredient: recipe,
                                amount: ingredient.amount,
                                unit: ingredient.unit,
                            }
                        }

                        return {
                            ingredient: fullIngredient,
                            amount: ingredient.amount,
                            unit: ingredient.unit,
                        }
                    })
                ),
                publicResources: recipe.publicResources,
            }))
        )
        return recipes
    } catch (e) {
        if (e instanceof Object && 'errorType' in e && e.errorType === 'DataError') {
            return e as DataError
        }
        if (e instanceof Object && 'errorType' in e && e.errorType === 'SessionError') {
            return e as SessionError
        }
    }
    return []
}

export const deleteRecipe = async (id: UUID, session: Session) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'recipes.json'
    )
    const recipes: Recipe[] = await getFromFile(filePath)
    const recipe = recipes.find((recipe) => recipe.id === id)
    if (recipe && recipe.pictures) {
        await recipe.pictures.forEach(async (picture) => await removeImage(picture))
    }
    const newRecipes = recipes.filter((recipe) => recipe.id !== id)
    await setToFile(filePath, newRecipes)
}

export const patchRecipe = async (
    {
        id,
        name,
        description,
        instructions,
        pictures,
        ingredients,
        cost,
        publicResources,
    }: PatchRecipeDTO,
    session: Session
) => {
    const filePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        session.login,
        'recipes.json'
    )

    const recipes = await getCompressedRecipes(session)
    if ('errorType' in recipes) {
        return recipes
    }
    const unchangedRecipes = recipes.filter((recipe) => recipe.id !== id)
    const toPatchRecipe = recipes.find((recipe) => recipe.id === id)
    if (!toPatchRecipe) {
        return dataError(`Przepis z id ${id} nie istnieje`)
    }

    if (!!pictures) {
        const toDelPictures = toPatchRecipe.pictures?.filter(
            (picture) => !pictures.includes(picture)
        )
        await toDelPictures?.forEach(async (picture) => await removeImage(picture))
    }

    if (ingredients) {
        if (ingredients.find((ingredient) => ingredient.id === toPatchRecipe.id)) {
            return dataError(`Nie można dawać placka do siebie samego`)
        }
        const fullRecipes = await getRecipes(session)
        if ('errorType' in fullRecipes) {
            return fullRecipes
        }
        try {
            ingredients.forEach((ingredient) => {
                if (recipes.find((recipe) => recipe.id === ingredient.id)) {
                    findRecipeLoops(toPatchRecipe.id, ingredient.id, fullRecipes!)
                }
            })
        } catch {
            return dataError(`Nie można dawać placka do siebie samego`)
        }
    }

    toPatchRecipe.name = name ?? toPatchRecipe.name
    toPatchRecipe.description = description
    toPatchRecipe.instructions = instructions
    toPatchRecipe.pictures = pictures
    toPatchRecipe.ingredients = ingredients ?? toPatchRecipe.ingredients
    toPatchRecipe.cost = cost
    toPatchRecipe.publicResources = publicResources ?? toPatchRecipe.publicResources

    const newRecipes = [...unchangedRecipes, toPatchRecipe]
    await setToFile(filePath, newRecipes)
    return [] as Success
}

const findRecipeLoops = (
    originalRecipeId: UUID,
    currentRecipeId: UUID,
    recipes: GetRecipeDTO[]
) => {
    const currentRecipe = recipes.find((recipe) => recipe.id === currentRecipeId)
    if (
        currentRecipe?.ingredients.find(
            (ingredient) => ingredient.ingredient.id === originalRecipeId
        )
    ) {
        throw new Error()
    }
    currentRecipe?.ingredients.forEach((ingredient) => {
        if (recipes.find((recipe) => recipe.id === ingredient.ingredient.id)) {
            findRecipeLoops(originalRecipeId, ingredient.ingredient.id, recipes)
        }
    })
}
