'use server'
import { Session } from '@/types/Auth'
import { CreateRecipeDTO, Recipe, PatchRecipeDTO, GetRecipeDTO } from '@/types/Recipe'
import { verifySession } from '@/utils/auth'
import { getFromFile, setToFile } from '@/utils/file'
import { randomUUID, UUID } from 'crypto'
import { join } from 'path'
import { getIngredientById } from '@/services/ingredientService'

export const createRecipe = async (
    { name, description, instructions, ingredients, cost }: CreateRecipeDTO,
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
        ingredients,
        cost,
        publicResources: [],
    }
    const recipes: Recipe[] = await getCompressedRecipes(session)
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

    const verification = await verifySession(session)
    if (verification) {
        const recipes: Recipe[] = await getFromFile(filePath)
        return recipes
    }
    throw new Error('Session is invalid')
}

export const getRecipes = async (session: Session) => {
    const compressedRecipes: Recipe[] = await getCompressedRecipes(session)
    const recipes: GetRecipeDTO[] = await Promise.all(
        compressedRecipes.map(async (recipe) => ({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
            pictures: recipe.pictures,
            ingredients: await Promise.all(
                recipe.ingredients.map(async (ingredient) => ({
                    ingredient: await getIngredientById(ingredient.id, session),
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                }))
            ),
            publicResources: recipe.publicResources,
        }))
    )

    return recipes
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

    const recipes: Recipe[] = await getCompressedRecipes(session)
    const unchangedRecipes = recipes.filter((recipe) => recipe.id !== id)
    const toPatchRecipe = recipes.find((recipe) => recipe.id === id)
    if (!toPatchRecipe) {
        throw new Error(`Recipe with id: ${id} does not exist`)
    }

    toPatchRecipe.name = name ?? toPatchRecipe.name
    toPatchRecipe.description = description ?? toPatchRecipe.description
    toPatchRecipe.instructions = instructions ?? toPatchRecipe.instructions
    toPatchRecipe.pictures = pictures ?? toPatchRecipe.pictures
    toPatchRecipe.ingredients = ingredients ?? toPatchRecipe.ingredients
    toPatchRecipe.cost = cost ?? toPatchRecipe.cost
    toPatchRecipe.publicResources = publicResources ?? toPatchRecipe.publicResources

    const newRecipes = [...unchangedRecipes, toPatchRecipe]
    await setToFile(filePath, newRecipes)
}
