import { massUnits, volumeUnits } from '@/constants/ingredients'
import { measurements } from '@/constants/measurements'
import { ConversionError } from '@/errors/conversionError'
import { IngredientAmount, IngredientSum, MassUnit, VolumeUnit } from '@/types/Ingredient'

export const calculateIngredients = (ingredients: IngredientAmount[]): IngredientSum => {
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

    const beautifiedIngredientAmount: IngredientAmount[] = ingredientAmount.map((ing) => {
        if (ing.amount > 1000) {
            return {
                ingredient: ing.ingredient,
                amount:
                    ing.unit !== 'szt.' ? Math.round(ing.amount / 10) / 100 : ing.amount,
                unit: ing.unit === 'mL' ? 'L' : ing.unit === 'g' ? 'Kg' : ing.unit,
            } as IngredientAmount
        }
        return ing
    })
    const sum: number = ingredientAmount.reduce(
        (acc, ing) => acc + ing.amount * (ing.ingredient.cost ?? 0),
        0
    )

    return { sum, ingredients: beautifiedIngredientAmount }
}

export const calculateKcal = (ingredients: IngredientAmount[]) => {
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
    return ingredientAmount.reduce(
        (acc, ing) => acc + ing.amount * (ing.ingredient.kcal ?? 0),
        0
    )
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
