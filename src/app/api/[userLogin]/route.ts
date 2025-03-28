import { DataError } from '@/errors/DataError'
import { Ingredient } from '@/types/Ingredient'
import { GetRecipeDTO, PublicRecipe, Recipe } from '@/types/Recipe'
import { getFromFile } from '@/utils/file'
import { NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userLogin: string }> }
) {
    const recipeFilePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        (await params).userLogin,
        'recipes.json'
    )
    const ingredientFilePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        (await params).userLogin,
        'ingredients.json'
    )
    const compressedRecipes: Recipe[] = await getFromFile(recipeFilePath)
    const ingredients: Ingredient[] = await getFromFile(ingredientFilePath)
    const recipes: GetRecipeDTO[] = compressedRecipes.map((recipe) => ({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        instructions: recipe.instructions,
        pictures: recipe.pictures,
        ingredients: recipe.ingredients.map((ingredientId) => {
            const ingredient = ingredients.find((ing) => ing.id === ingredientId.id)
            if (ingredient === undefined) {
                throw new DataError(`Składnik z id ${ingredientId.id} nie istnieje`)
            }
            return {
                ingredient,
                amount: ingredientId.amount,
                unit: ingredientId.unit,
            }
        }),
        cost: recipe.cost,
        publicResources: recipe.publicResources,
    }))
    const publicRecipes = recipes.filter((recipe) => recipe.publicResources.length)

    return NextResponse.json({
        publicRecipes: publicRecipes.map((recipe) =>
            recipe.publicResources.reduce(
                (acc, key) => ({ ...acc, [key]: recipe[key] }),
                {
                    id: recipe.id,
                } as PublicRecipe
            )
        ),
    })
}
