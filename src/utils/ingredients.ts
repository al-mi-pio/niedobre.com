import { foodGroups, massUnits, units } from '@/constants/ingredients'
import { measurements } from '@/constants/measurements'
import { emptyUUID } from '@/constants/general'
import { ValidationError } from '@/errors/ValidationError'
import {
    FoodGroup,
    Ingredient,
    PatchIngredientDTO,
    CreateIngredientDTO,
    IngredientFormData,
    IngredientFormDataUnits,
    MassUnit,
    Unit,
} from '@/types/Ingredient'
import { positiveFloatValidation } from '@/utils/validate'
import { ValidationData, ValidationErrorPayload } from '@/types/default'
import { UUID } from 'crypto'
import { getCompressedRecipes, patchRecipe } from '@/services/recipeService'
import { Session } from '@/types/Auth'
import { deleteIngredient } from '@/services/ingredientService'
import { SessionError } from '@/errors/SessionError'

export const ingredientToForm = (ingredient: Ingredient): IngredientFormData => {
    const units: IngredientFormDataUnits =
        ingredient.type === 'amount'
            ? {
                  unit: 'szt.',
                  oppositeUnit: ingredient.conversion ? 'szt.' : undefined,
              }
            : ingredient.type === 'mass'
              ? {
                    unit: 'g',
                    oppositeUnit: ingredient.conversion ? 'mL' : undefined,
                }
              : { unit: 'mL', oppositeUnit: ingredient.conversion ? 'g' : undefined }
    const requiredNutrientAmount =
        ingredient.kcal !== undefined ||
        ingredient.fat !== undefined ||
        ingredient.protein !== undefined ||
        ingredient.carbohydrates !== undefined ||
        ingredient.salt !== undefined
    return {
        id: ingredient.id,
        name: ingredient.name,
        kcal: ingredient.kcal?.toString(),
        protein: ingredient.protein?.toString(),
        fat: ingredient.fat?.toString(),
        carbohydrates: ingredient.carbohydrates?.toString(),
        salt: ingredient.salt?.toString(),
        nutrientAmount: requiredNutrientAmount ? '1' : undefined,
        amount: !ingredient.conversion ? undefined : '1',
        oppositeAmount: !ingredient.conversion
            ? undefined
            : ingredient.conversion?.toFixed(3),
        costAmount: !ingredient.cost ? undefined : ingredient.cost < 0.01 ? '1000' : ' 1',
        cost: !ingredient.cost
            ? undefined
            : ingredient.cost < 0.01
              ? (ingredient.cost * 1000).toString()
              : ingredient.cost.toString(),
        ...units,
        foodGroup: ingredient.foodGroup,
    }
}

const validateFormData = (form: IngredientFormData) => {
    const errors: ValidationErrorPayload = {}

    if (!form.unit) {
        errors['unit'] = 'Pole wymagane'
    }
    if (!form.name) {
        errors['name'] = 'Pole wymagane'
    }
    if (form.unit && !units.includes(form.unit)) {
        errors['unit'] = 'Zła jednostka'
    }
    if (form.oppositeUnit && !units.includes(form.oppositeUnit as Unit)) {
        errors['oppositeUnit'] = 'Zła jednostka'
    }
    if (form.foodGroup && !foodGroups.includes(form.foodGroup as FoodGroup)) {
        errors['foodGroup'] = 'Zła kategoria'
    }
    const floatVariables: ValidationData[] = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'nutrientAmount', value: form.nutrientAmount },
        { name: 'kcal', value: form.kcal !== '0' ? form.kcal : '1' },
        { name: 'fat', value: form.fat !== '0' ? form.fat : '1' },
        { name: 'protein', value: form.protein !== '0' ? form.protein : '1' },
        {
            name: 'carbohydrates',
            value: form.carbohydrates !== '0' ? form.carbohydrates : '1',
        },
        { name: 'salt', value: form.salt !== '0' ? form.salt : '1' },
    ]
    floatVariables.forEach((variable) => {
        if (variable.value && !positiveFloatValidation(variable.value)) {
            errors[variable.name as keyof IngredientFormData] = 'Błędna wartość'
        }
    })

    const missingCostVariables = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
    ].filter((data) => !data.value)
    const missingConversionVariables: ValidationData[] = [
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'oppositeUnit', value: form.oppositeUnit as string },
    ].filter((data) => !data.value)

    if (missingCostVariables.length === 1) {
        errors[missingCostVariables[0].name as keyof IngredientFormData] =
            'Brakuje wartości do wyliczenia kosztu'
    }

    if (
        missingConversionVariables.length === 1 ||
        missingConversionVariables.length === 2
    ) {
        missingConversionVariables.forEach((missingVairable) => {
            errors[missingVairable.name as keyof IngredientFormData] =
                'Brakuje wartości do wyliczenia konwersji'
        })
    }

    if (
        !form.nutrientAmount &&
        (form.kcal || form.protein || form.fat || form.carbohydrates || form.salt)
    ) {
        errors['nutrientAmount' as keyof IngredientFormData] =
            'Brakuje wartości do wyliczenia składników odżywczych'
    }

    if (Object.keys(errors).length) {
        return new ValidationError('Napraw błędne pola', errors)
    }

    return {}
}

const variables = (form: IngredientFormData) => {
    const costVariables = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
    ].filter((data) => data.value)
    const conversionVariables: ValidationData[] = [
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'oppositeUnit', value: form.oppositeUnit as string },
    ].filter((data) => data.value)

    return {
        costVariables,
        conversionVariables,
    }
}
export const formToCreateIngredientDTO = (form: IngredientFormData) => {
    form.amount = form.amount?.replace(',', '.')
    form.oppositeAmount = form.oppositeAmount?.replace(',', '.')
    form.costAmount = form.costAmount?.replace(',', '.')
    form.cost = form.cost?.replace(',', '.')
    form.foodGroup = form.foodGroup?.replace(',', '.')
    form.nutrientAmount = form.nutrientAmount?.replace(',', '.')
    form.kcal = form.kcal?.replace(',', '.')
    form.protein = form.protein?.replace(',', '.')
    form.fat = form.fat?.replace(',', '.')
    form.carbohydrates = form.carbohydrates?.replace(',', '.')
    form.salt = form.salt?.replace(',', '.')
    const validation = validateFormData(form)
    if (validation instanceof ValidationError) {
        return validation
    }

    const { costVariables, conversionVariables } = variables(form)

    return {
        name: form.name,
        type:
            form.unit === 'szt.'
                ? 'amount'
                : massUnits.includes(form.unit! as MassUnit)
                  ? 'mass'
                  : 'volume',
        cost: costVariables.length
            ? parseFloat(costVariables[0].value!) /
              (parseFloat(costVariables[1].value!) *
                  measurements[form.unit as keyof typeof measurements])
            : undefined,
        conversion:
            form.unit === 'szt.'
                ? undefined
                : conversionVariables.length
                  ? parseFloat(
                        (
                            (parseFloat(conversionVariables[0].value!) *
                                measurements[form.unit as keyof typeof measurements]) /
                            (parseFloat(conversionVariables[1].value!) *
                                measurements[
                                    form.oppositeUnit as keyof typeof measurements
                                ])
                        ).toFixed(3)
                    )
                  : undefined,
        kcal: form.kcal
            ? parseFloat(
                  (
                      (parseFloat(form.kcal) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        protein: form.protein
            ? parseFloat(
                  (
                      (parseFloat(form.protein) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        fat: form.fat
            ? parseFloat(
                  (
                      (parseFloat(form.fat) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        carbohydrates: form.carbohydrates
            ? parseFloat(
                  (
                      (parseFloat(form.carbohydrates) /
                          parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        salt: form.salt
            ? parseFloat(
                  (
                      (parseFloat(form.salt) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        foodGroup: (form.foodGroup as FoodGroup) ?? 'inne',
    } as CreateIngredientDTO
}

export const formToPatchIngredientDTO = (form: IngredientFormData) => {
    form.amount = form.amount?.replace(',', '.')
    form.oppositeAmount = form.oppositeAmount?.replace(',', '.')
    form.costAmount = form.costAmount?.replace(',', '.')
    form.cost = form.cost?.replace(',', '.')
    form.foodGroup = form.foodGroup?.replace(',', '.')
    form.nutrientAmount = form.nutrientAmount?.replace(',', '.')
    form.kcal = form.kcal?.replace(',', '.')
    form.protein = form.protein?.replace(',', '.')
    form.fat = form.fat?.replace(',', '.')
    form.carbohydrates = form.carbohydrates?.replace(',', '.')
    form.salt = form.salt?.replace(',', '.')
    const validation = validateFormData(form)
    if (validation instanceof ValidationError) {
        return validation
    }

    const { costVariables, conversionVariables } = variables(form)

    return {
        id: form.id ?? emptyUUID,
        name: form.name,
        type:
            form.unit === 'szt.'
                ? 'amount'
                : massUnits.includes(form.unit! as MassUnit)
                  ? 'mass'
                  : 'volume',
        cost: costVariables.length
            ? parseFloat(costVariables[0].value!) /
              (parseFloat(costVariables[1].value!) *
                  measurements[form.unit as keyof typeof measurements])
            : undefined,
        conversion:
            form.unit === 'szt.'
                ? undefined
                : conversionVariables.length
                  ? parseFloat(
                        (
                            (parseFloat(conversionVariables[0].value!) *
                                measurements[form.unit as keyof typeof measurements]) /
                            (parseFloat(conversionVariables[1].value!) *
                                measurements[
                                    form.oppositeUnit as keyof typeof measurements
                                ])
                        ).toFixed(3)
                    )
                  : undefined,
        kcal: form.kcal
            ? parseFloat(
                  (
                      (parseFloat(form.kcal) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        protein: form.protein
            ? parseFloat(
                  (
                      (parseFloat(form.protein) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        fat: form.fat
            ? parseFloat(
                  (
                      (parseFloat(form.fat) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        carbohydrates: form.carbohydrates
            ? parseFloat(
                  (
                      (parseFloat(form.carbohydrates) /
                          parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        salt: form.salt
            ? parseFloat(
                  (
                      (parseFloat(form.salt) / parseFloat(form.nutrientAmount!)) *
                      measurements[form.unit as keyof typeof measurements]
                  ).toFixed(4)
              )
            : undefined,
        foodGroup: form.foodGroup as FoodGroup,
    } as PatchIngredientDTO
}

export const safeIngredientDeletion = async (
    ingredientId: UUID,
    session: Session,
    commitDeletion?: boolean
) => {
    const recipes = await getCompressedRecipes(session)
    if (recipes instanceof SessionError) {
        return recipes
    }
    const recipesWithIngredients = recipes.filter(
        (recipe) =>
            recipe.ingredients.filter((ingredient) => ingredient.id === ingredientId)
                .length
    )
    if (!commitDeletion) {
        return recipesWithIngredients.reduce(
            (prev, curr) => [...prev, curr.name],
            [] as string[]
        )
    }

    await deleteIngredient(ingredientId, session)
    recipesWithIngredients.forEach((recipe) =>
        patchRecipe(
            {
                id: recipe.id,
                ingredients: recipe.ingredients.filter(
                    (ingredient) => ingredient.id !== ingredientId
                ),
            },
            session
        )
    )
    return [] as string[]
}
