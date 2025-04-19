import { massUnits, volumeUnits } from '@/constants/ingredients'
import { measurements } from '@/constants/measurements'
import { ConversionError } from '@/errors/ConversionError'
import {
    IngredientAmount,
    IngredientSum,
    MassUnit,
    NutrientValues,
    VolumeUnit,
} from '@/types/Ingredient'
import { SelectedRecipes } from '@/app/(dashboard)/page'

const combineIngredients = (selectedRecipes: SelectedRecipes) => {
    const ingredients: IngredientAmount[] = []
    Object.values(selectedRecipes).forEach((recipe) => {
        ingredients.push(
            ...recipe.ingredients.map((ing) => ({
                ...ing,
                amount: ing.amount * recipe.amount,
            }))
        )
    })

    let ingredientAmount: IngredientAmount[] = []

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

export const calculateIngredients = (selectedRecipes: SelectedRecipes) => {
    const ingredientAmount: IngredientAmount[] = []
    try {
        ingredientAmount.push(...combineIngredients(selectedRecipes))
    } catch (e) {
        if (e instanceof ConversionError) {
            return e
        }
    }
    const beautifiedIngredientAmount: IngredientAmount[] = ingredientAmount.map((ing) => {
        if (ing.amount > 1000) {
            return {
                ingredient: ing.ingredient,
                amount:
                    ing.unit !== 'szt.' ? Math.round(ing.amount / 10) / 100 : ing.amount,
                unit: ing.unit === 'mL' ? 'L' : ing.unit === 'g' ? 'Kg' : ing.unit,
            } as IngredientAmount
        } else {
            return {
                ingredient: ing.ingredient,
                amount:
                    ing.unit !== 'szt.' ? Math.round(ing.amount * 100) / 100 : ing.amount,
                unit: ing.unit,
            } as IngredientAmount
        }

    })
    const sum = ingredientAmount
        .reduce((acc, ing) => acc + ing.amount * (ing.ingredient.cost ?? 0), 0)
        .toFixed(2)
        .replace('.', ',')

    return { sum, ingredients: beautifiedIngredientAmount } as IngredientSum
}

export const calculateNutrients = (selectedRecipes: SelectedRecipes): NutrientValues => {
    const ingredients = combineIngredients(selectedRecipes)
    return {
        kcal: ingredients
            .reduce((acc, ing) => acc + ing.amount * (ing.ingredient.kcal ?? 0), 0)
            .toFixed(0)
            .replace('.', ','),
        protein: ingredients
            .reduce((acc, ing) => acc + ing.amount * (ing.ingredient.protein ?? 0), 0)
            .toFixed(0)
            .replace('.', ','),
        fat: ingredients
            .reduce((acc, ing) => acc + ing.amount * (ing.ingredient.fat ?? 0), 0)
            .toFixed(0)
            .replace('.', ','),
        carbohydrates: ingredients
            .reduce(
                (acc, ing) => acc + ing.amount * (ing.ingredient.carbohydrates ?? 0),
                0
            )
            .toFixed(0)
            .replace('.', ','),
        salt: ingredients
            .reduce((acc, ing) => acc + ing.amount * (ing.ingredient.salt ?? 0), 0)
            .toFixed(0)
            .replace('.', ','),
    }
}

const convertToBaseMeasurement = (ingredient: IngredientAmount): IngredientAmount => {
    if (ingredient.ingredient.type === 'mass') {
        const baseAmount = Math.round(
            measurements[ingredient.unit as keyof typeof measurements] * ingredient.amount
        )
        if (
            volumeUnits.includes(ingredient.unit as VolumeUnit) &&
            ingredient.ingredient.conversion === undefined
        ) {
            throw new ConversionError('Brak przelicznika z masy na objętość')
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
            throw new ConversionError('Brak przelicznika z objętośći na masę')
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
        throw new ConversionError('Nie można konwertować policzalnych składników')
    }
    return ingredient
}
