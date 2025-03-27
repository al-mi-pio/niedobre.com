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
        kcal: ingredient.kcal?.toString(),
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
    const cost = !form.cost ? undefined : parseFloat(form.cost)
    const costAmount = !form.costAmount ? undefined : parseFloat(form.costAmount)
    const amount = !form.amount ? undefined : parseFloat(form.amount)
    const oppositeAmount = !form.oppositeAmount
        ? undefined
        : parseFloat(form.oppositeAmount)
    const kcal = !form.kcal ? undefined : parseFloat(form.kcal)

    return {
        name: form.name,
        type:
            form.unit === 'szt.' ? 'amount' : form.unit in massUnits ? 'mass' : 'volume',
        cost:
            !cost || !costAmount
                ? undefined
                : cost /
                  (costAmount * measurements[form.unit as keyof typeof measurements]),
        conversion:
            !form.unit || !form.oppositeUnit || !amount || !oppositeAmount
                ? undefined
                : parseFloat(
                      (
                          (amount *
                              measurements[form.unit as keyof typeof measurements]) /
                          (oppositeAmount *
                              measurements[
                                  form.oppositeUnit as keyof typeof measurements
                              ])
                      ).toFixed(3)
                  ),
        kcal,
    }
}

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
    const cost = !form.cost ? undefined : parseFloat(form.cost)
    const costAmount = !form.costAmount ? undefined : parseFloat(form.costAmount)
    const amount = !form.amount ? undefined : parseFloat(form.amount)
    const oppositeAmount = !form.oppositeAmount
        ? undefined
        : parseFloat(form.oppositeAmount)
    const kcal = !form.kcal ? undefined : parseFloat(form.kcal)

    return {
        id: form.id,
        name: form.name,
        type:
            form.unit === 'szt.' ? 'amount' : form.unit in massUnits ? 'mass' : 'volume',
        cost:
            !cost || !costAmount
                ? undefined
                : cost /
                  (costAmount * measurements[form.unit as keyof typeof measurements]),
        conversion:
            !form.unit || !form.oppositeUnit || !amount || !oppositeAmount
                ? undefined
                : parseFloat(
                      (
                          (amount *
                              measurements[form.unit as keyof typeof measurements]) /
                          (oppositeAmount *
                              measurements[
                                  form.oppositeUnit as keyof typeof measurements
                              ])
                      ).toFixed(3)
                  ),
        kcal,
    }
}
