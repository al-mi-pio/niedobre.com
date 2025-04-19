'use server'
import { Session } from '@/types/Auth'
import { CreateRecipeDTO, Recipe, PatchRecipeDTO, GetRecipeDTO } from '@/types/Recipe'
import { verifySession } from '@/utils/auth'
import { getFromFile, removeImage, setToFile } from '@/utils/file'
import { randomUUID, UUID } from 'crypto'
import { join } from 'path'
import { getIngredientById } from '@/services/ingredientService'
import { DataError } from '@/errors/DataError'
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
    if (recipes instanceof SessionError) {
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
    if (verifiedSession instanceof SessionError) {
        return verifiedSession
    }

    const recipes: Recipe[] = await getFromFile(filePath)
    return recipes
}

export const getRecipes = async (session: Session) => {
    const compressedRecipes = await getCompressedRecipes(session)
    if (compressedRecipes instanceof SessionError) {
        return compressedRecipes
    }
    try {
        const recipes: GetRecipeDTO[] = await Promise.all(
            compressedRecipes.map(async (recipe) => ({
                id: recipe.id,
                name: recipe.name,
                description: recipe.description,
                instructions: recipe.instructions,
                pictures: recipe.pictures,
                ingredients: await Promise.all(
                    recipe.ingredients.map(async (ingredient) => {
                        const fullIngredient = await getIngredientById(
                            ingredient.id,
                            session
                        )
                        if (fullIngredient instanceof SessionError) {
                            throw fullIngredient
                        }
                        if (fullIngredient instanceof DataError) {
                            throw fullIngredient
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
        if (e instanceof DataError || e instanceof SessionError) {
            return e
        }
    }
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
    const recipe = recipes.filter((recipe) => recipe.id === id)[0]
    if (recipe.pictures) {
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
    if (recipes instanceof SessionError) {
        return recipes
    }
    const unchangedRecipes = recipes.filter((recipe) => recipe.id !== id)
    const toPatchRecipe = recipes.find((recipe) => recipe.id === id)
    if (!toPatchRecipe) {
        return new DataError(`Przepis z id ${id} nie istnieje`)
    }

    if (!!pictures) {
        const toDelPictures = toPatchRecipe.pictures?.filter(
            (picture) => !pictures.includes(picture)
        )
        await toDelPictures?.forEach(async (picture) => await removeImage(picture))
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
}
