'use server'
import { massUnits, volumeUnits } from '@/constants/ingredients'
import { measurements } from '@/constants/measurements'
import { ConversionError, conversionError } from '@/errors/ConversionError'
import {
    FlatIngredientAmount,
    Ingredient,
    IngredientAmount,
    IngredientSum,
    MassUnit,
    NutrientValues,
    VolumeUnit,
} from '@/types/Ingredient'
import { SelectedRecipes } from '@/app/(dashboard)/page'
import { getFromFile } from '@/utils/file'
import { join } from 'path'
import { Recipe } from '@/types/Recipe'
import { DataError } from '@/errors/DataError'

const selectRecipesToIngredientAmount = (selectedRecipes: SelectedRecipes) => {
    const ingredients: IngredientAmount[] = []
    Object.values(selectedRecipes).forEach((recipe) => {
        if (recipe.amount) {
            ingredients.push(
                ...recipe.ingredients.map((ing) => ({
                    ...ing,
                    amount: ing.amount * recipe.amount,
                }))
            )
        }
    })

    return ingredients
}

const combineIngredients = (ingredients: FlatIngredientAmount[]) => {
    let ingredientAmount: FlatIngredientAmount[] = []

    ingredients.forEach((ingredient) => {
        const ingredientToUpdate = ingredientAmount.find(
            (ing) => ing.ingredient.id === ingredient.ingredient.id
        )
        if (ingredientToUpdate) {
            ingredientToUpdate.amount += convertToBaseMeasurement(ingredient).amount
            const otherIngredients = ingredientAmount.filter(
                (ing) => ing.ingredient.id !== ingredient.ingredient.id
            )
            ingredientAmount = [...otherIngredients, ingredientToUpdate]
        } else {
            ingredientAmount = [...ingredientAmount, convertToBaseMeasurement(ingredient)]
        }
    })

    return ingredientAmount
}

const flattenRecipes = (
    ingredientAmount: IngredientAmount[],
    allIngredients: Ingredient[],
    allRecipes: Recipe[],
    amountOfRecipes: number = 1,
    flattenedRecipe: FlatIngredientAmount[] = []
): FlatIngredientAmount[] => {
    ingredientAmount.forEach((ing) => {
        if ('ingredients' in ing.ingredient) {
            const ingredients: IngredientAmount[] = ing.ingredient.ingredients.map(
                (ingredientId) => {
                    const ingredient = allIngredients.find(
                        (ing) => ing.id === ingredientId.id
                    )
                    if (ingredient) {
                        return {
                            ingredient: ingredient,
                            amount: ingredientId.amount,
                            unit: ingredientId.unit,
                        }
                    }
                    const recipe = allRecipes.find((ing) => ing.id === ingredientId.id)
                    return {
                        ingredient: recipe!,
                        amount: ingredientId.amount,
                        unit: ingredientId.unit,
                    }
                }
            )
            flattenRecipes(
                ingredients,
                allIngredients,
                allRecipes,
                ing.amount * amountOfRecipes,
                flattenedRecipe
            )
        } else {
            flattenedRecipe.push({
                ingredient: ing.ingredient,
                amount: ing.amount * amountOfRecipes,
                unit: ing.unit,
            })
        }
    })
    return flattenedRecipe
}

export const calculateIngredients = async (
    selectedRecipes: SelectedRecipes,
    userLogin: string
) => {
    try {
        const ingredientFilePath = join(
            process.cwd(),
            'src',
            'data',
            'users',
            userLogin,
            'ingredients.json'
        )
        const recipeFilePath = join(
            process.cwd(),
            'src',
            'data',
            'users',
            userLogin,
            'recipes.json'
        )
        const allRecipes: Recipe[] = await getFromFile(recipeFilePath)
        const allIngredients: Ingredient[] = await getFromFile(ingredientFilePath)

        const ingredientAmount: IngredientAmount[] =
            selectRecipesToIngredientAmount(selectedRecipes)
        const flattenedRecipe = combineIngredients(
            flattenRecipes(ingredientAmount, allIngredients, allRecipes)
        )
        const beautifiedIngredientAmount: FlatIngredientAmount[] = flattenedRecipe.map(
            (ing) => {
                if (ing.amount > 1000) {
                    return {
                        ingredient: ing.ingredient,
                        amount:
                            ing.unit !== 'szt.'
                                ? Math.round(ing.amount / 10) / 100
                                : ing.amount,
                        unit:
                            ing.unit === 'mL' ? 'L' : ing.unit === 'g' ? 'Kg' : ing.unit,
                    } as FlatIngredientAmount
                } else {
                    return {
                        ingredient: ing.ingredient,
                        amount:
                            ing.unit !== 'szt.'
                                ? Math.round(ing.amount * 100) / 100
                                : ing.amount,
                        unit: ing.unit,
                    } as FlatIngredientAmount
                }
            }
        )
        const sum = ingredientAmount
            .reduce((acc, ing) => acc + ing.amount * (ing.ingredient.cost ?? 0), 0)
            .toFixed(2)
            .replace('.', ',')

        return { sum, ingredients: beautifiedIngredientAmount } as IngredientSum
    } catch (e) {
        if (
            e instanceof Object &&
            'errorType' in e &&
            e.errorType === 'ConversionError'
        ) {
            return e as ConversionError
        } else {
            return e as DataError
        }
    }
}

export const calculateNutrients = async (
    selectedRecipes: SelectedRecipes,
    userLogin: string
) => {
    try {
        const ingredients = selectRecipesToIngredientAmount(selectedRecipes)
        const ingredientFilePath = join(
            process.cwd(),
            'src',
            'data',
            'users',
            userLogin,
            'ingredients.json'
        )
        const recipeFilePath = join(
            process.cwd(),
            'src',
            'data',
            'users',
            userLogin,
            'recipes.json'
        )
        const allRecipes: Recipe[] = await getFromFile(recipeFilePath)
        const allIngredients: Ingredient[] = await getFromFile(ingredientFilePath)
        const flattenedRecipe = combineIngredients(
            flattenRecipes(ingredients, allIngredients, allRecipes)
        )
        console.log(flattenedRecipe)
        console.log(
            flattenedRecipe.reduce(
                (acc, ing) => (acc ? true : ing.ingredient.kcal !== undefined),
                false
            )
                ? flattenedRecipe
                      .reduce(
                          (acc, ing) => acc + ing.amount * (ing.ingredient.kcal ?? 0),
                          0
                      )
                      .toFixed(0)
                      .replace('.', ',')
                : ''
        )
        return {
            kcal: flattenedRecipe.reduce(
                (acc, ing) => (acc ? true : ing.ingredient.kcal !== undefined),
                false
            )
                ? flattenedRecipe
                      .reduce(
                          (acc, ing) => acc + ing.amount * (ing.ingredient.kcal ?? 0),
                          0
                      )
                      .toFixed(0)
                      .replace('.', ',')
                : '',
            protein: flattenedRecipe.reduce(
                (acc, ing) => (acc ? true : ing.ingredient.protein !== undefined),
                false
            )
                ? flattenedRecipe
                      .reduce(
                          (acc, ing) => acc + ing.amount * (ing.ingredient.protein ?? 0),
                          0
                      )
                      .toFixed(0)
                      .replace('.', ',')
                : '',
            fat: flattenedRecipe.reduce(
                (acc, ing) => (acc ? true : ing.ingredient.fat !== undefined),
                false
            )
                ? flattenedRecipe
                      .reduce(
                          (acc, ing) => acc + ing.amount * (ing.ingredient.fat ?? 0),
                          0
                      )
                      .toFixed(0)
                      .replace('.', ',')
                : '',
            carbohydrates: flattenedRecipe.reduce(
                (acc, ing) => (acc ? true : ing.ingredient.carbohydrates !== undefined),
                false
            )
                ? flattenedRecipe
                      .reduce(
                          (acc, ing) =>
                              acc + ing.amount * (ing.ingredient.carbohydrates ?? 0),
                          0
                      )
                      .toFixed(0)
                      .replace('.', ',')
                : '',
            salt: flattenedRecipe.reduce(
                (acc, ing) => (acc ? true : ing.ingredient.salt !== undefined),
                false
            )
                ? flattenedRecipe
                      .reduce(
                          (acc, ing) => acc + ing.amount * (ing.ingredient.salt ?? 0),
                          0
                      )
                      .toFixed(0)
                      .replace('.', ',')
                : '',
        } as NutrientValues
    } catch (e) {
        if (e instanceof Object && 'errorType' in e && e.errorType === 'DataError') {
            return e as DataError
        } else {
            return e as ConversionError
        }
    }
}

const convertToBaseMeasurement = (ingredient: IngredientAmount): FlatIngredientAmount => {
    if ('ingredients' in ingredient.ingredient) {
        return {
            ingredient: {
                id: ingredient.ingredient.id,
                name: ingredient.ingredient.name,
                type: 'amount',
                foodGroup: 'inne',
            },
            amount: ingredient.amount,
            unit: 'szt.',
        }
    }
    if (ingredient.ingredient.type === 'mass') {
        const baseAmount = Math.round(
            measurements[ingredient.unit as keyof typeof measurements] * ingredient.amount
        )
        if (
            volumeUnits.includes(ingredient.unit as VolumeUnit) &&
            ingredient.ingredient.conversion === undefined
        ) {
            throw conversionError('Brak przelicznika z masy na objętość')
        }
        const amount = volumeUnits.includes(ingredient.unit as VolumeUnit)
            ? baseAmount * ingredient.ingredient.conversion!
            : baseAmount

        return {
            ingredient: ingredient.ingredient,
            amount,
            unit: 'g',
        }
    }
    if (ingredient.ingredient.type === 'volume') {
        const baseAmount = Math.round(
            measurements[ingredient.unit as keyof typeof measurements] * ingredient.amount
        )
        if (
            massUnits.includes(ingredient.unit as MassUnit) &&
            ingredient.ingredient.conversion === undefined
        ) {
            throw conversionError('Brak przelicznika z objętośći na masę')
        }
        const amount = massUnits.includes(ingredient.unit as MassUnit)
            ? baseAmount * ingredient.ingredient.conversion!
            : baseAmount

        return {
            ingredient: ingredient.ingredient,
            amount,
            unit: 'mL',
        }
    }
    if (ingredient.unit !== 'szt.') {
        throw conversionError('Nie można konwertować policzalnych składników')
    }
    return {
        ingredient: ingredient.ingredient,
        amount: ingredient.amount,
        unit: 'szt.',
    }
}
