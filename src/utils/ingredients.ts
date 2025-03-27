import { massUnits } from '@/constants/ingredients'
import { measurements } from '@/constants/measurements'
import {
    CreateIngredientDTO,
    Ingredient,
    IngredientFormData,
    IngredientFormDataUnits,
    PatchIngredientDTO,
} from '@/types/Ingredient'

export const ingredientToForm = (ingredient: Ingredient): IngredientFormData => {
    const units: IngredientFormDataUnits =
        ingredient.type === 'amount'
            ? {
                  unit: 'szt.',
                  oppositeUnit: 'szt.',
              }
            : ingredient.type === 'mass'
              ? {
                    unit: 'g',
                    oppositeUnit: 'mL',
                }
              : { unit: 'mL', oppositeUnit: 'g' }
    return {
        id: ingredient.id,
        name: ingredient.name,
        kcal: ingredient.kcal,
        amount: ingredient.conversion === undefined ? undefined : 1,
        oppositeAmount:
            ingredient.conversion === undefined
                ? undefined
                : parseFloat(ingredient.conversion?.toFixed(3)),
        costAmount:
            ingredient.cost === undefined ? undefined : ingredient.cost < 0.01 ? 1000 : 1,
        cost:
            ingredient.cost === undefined
                ? undefined
                : ingredient.cost < 0.01
                  ? ingredient.cost * 1000
                  : ingredient.cost,
        ...units,
    }
}

export const formToCreateIngredientDTO = (
    form: IngredientFormData
): CreateIngredientDTO => {
    if (!form.unit) {
        throw new Error('No unit found')
    }
    if (form.name === '') {
        throw new Error('Bad name')
    }
    return {
        name: form.name,
        type:
            form.unit === 'szt.' ? 'amount' : form.unit in massUnits ? 'mass' : 'volume',
        cost:
            form.costAmount === undefined || form.cost === undefined
                ? undefined
                : form.cost /
                  (form.costAmount *
                      measurements[form.unit as keyof typeof measurements]),
        conversion:
            form.unit === undefined ||
            form.oppositeUnit === undefined ||
            form.amount === undefined ||
            form.oppositeAmount === undefined
                ? undefined
                : parseFloat(
                      (
                          (form.amount *
                              measurements[form.unit as keyof typeof measurements]) /
                          (form.oppositeAmount *
                              measurements[
                                  form.oppositeUnit as keyof typeof measurements
                              ])
                      ).toFixed(3)
                  ),
        kcal: form.kcal,
    }
}

// TODO
export const formToPatchIngredientDTO = (
    form: IngredientFormData
): PatchIngredientDTO => {
    if (!form.id) {
        throw new Error('id')
    }
    if (!form.unit) {
        throw new Error('No unit found')
    }
    if (form.name === '') {
        throw new Error('Bad name')
    }
    return {
        id: form.id,
        name: form.name,
        type:
            form.unit === 'szt.' ? 'amount' : form.unit in massUnits ? 'mass' : 'volume',
        cost:
            form.costAmount === undefined || form.cost === undefined
                ? undefined
                : form.cost /
                  (form.costAmount *
                      measurements[form.unit as keyof typeof measurements]),
        conversion:
            form.unit === undefined ||
            form.oppositeUnit === undefined ||
            form.amount === undefined ||
            form.oppositeAmount === undefined
                ? undefined
                : parseFloat(
                      (
                          (form.amount *
                              measurements[form.unit as keyof typeof measurements]) /
                          (form.oppositeAmount *
                              measurements[
                                  form.oppositeUnit as keyof typeof measurements
                              ])
                      ).toFixed(3)
                  ),
        kcal: form.kcal,
    }
}
