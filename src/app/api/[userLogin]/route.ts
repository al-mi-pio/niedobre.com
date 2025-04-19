import { GetRecipeDTO, PublicRecipe, Recipe } from '@/types/Recipe'
import { NextResponse } from 'next/server'
import { Ingredient } from '@/types/Ingredient'
import { DataError } from '@/errors/DataError'
import { emptyUUID } from '@/constants/general'
import { join } from 'path'
import { getFromFile } from '@/utils/file'
import { calculateNutrients } from '@/utils/conversion'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userLogin: string }> }
) {
    const userLogin = (await params).userLogin
    const recipeFilePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        userLogin,
        'recipes.json'
    )
    const ingredientFilePath = join(
        process.cwd(),
        'src',
        'data',
        'users',
        userLogin,
        'ingredients.json'
    )

    const compressedRecipes: Recipe[] = await getFromFile(recipeFilePath)
    const ingredients: Ingredient[] = await getFromFile(ingredientFilePath)

    try {
        const recipes: GetRecipeDTO[] = compressedRecipes.map((recipe) => ({
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions,
            pictures: recipe.pictures,
            ingredients: recipe.ingredients.map((ingredientId) => {
                const ingredient = ingredients.find((ing) => ing.id === ingredientId.id)
                if (ingredient === undefined) {
                    const recipe = recipes.find((rec) => rec.id === ingredientId.id)
                    if (recipe === undefined) {
                        throw new DataError(
                            `Składnik z id ${ingredientId.id} nie istnieje`
                        )
                    }

                    return {
                        ingredient: {
                            id: recipe.id,
                            name: recipe.name,
                            type: 'amount',
                        } as Ingredient,
                        amount: ingredientId.amount,
                        unit: ingredientId.unit,
                    }
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
            publicRecipes: await Promise.all(
                publicRecipes.map(async (recipe) => {
                    const reduced = await recipe.publicResources.reduce(
                        async (accPromise, key) => {
                            let acc = await accPromise

                            if (key === 'ingredients') {
                                acc.ingredients = recipe.ingredients
                                acc.nutrients = await calculateNutrients(
                                    {
                                        [emptyUUID]: {
                                            amount: 1,
                                            name: 'dupa',
                                            ingredients: recipe.ingredients.map(
                                                (ingredientAmount) => {
                                                    const ingredient = ingredients.find(
                                                        (ing) =>
                                                            ing.id ===
                                                            ingredientAmount.ingredient.id
                                                    )
                                                    return {
                                                        ingredient: ingredient!,
                                                        amount: ingredientAmount.amount,
                                                        unit: ingredientAmount.unit,
                                                    }
                                                }
                                            ),
                                        },
                                    },
                                    userLogin
                                )
                            } else if (key === 'pictures') {
                                acc.pictures = recipe.pictures?.map(
                                    (picturePath) =>
                                        request.url.slice(0, -4 - userLogin.length) +
                                        'pictures/' +
                                        picturePath
                                )
                            } else {
                                acc = {
                                    ...acc,
                                    [key]:
                                        recipe[
                                        key as keyof Omit<PublicRecipe, 'nutrients'>
                                        ] || null,
                                }
                            }

                            return acc
                        },
                        Promise.resolve({ id: recipe.id } as PublicRecipe)
                    )

                    return reduced
                })
            ),
        })
    } catch (e) {
        if (e instanceof DataError) {
            return NextResponse.json(e)
        }
    }
}
