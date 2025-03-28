import { foodGroups, massUnits, units } from '@/constants/ingredients'
import { measurements } from '@/constants/measurements'
import { ValidationError } from '@/errors/ValidationError'
import {
    CreateIngredientDTO,
    FoodGroup,
    Ingredient,
    IngredientFormData,
    IngredientFormDataUnits,
    MassUnit,
    PatchIngredientDTO,
    Unit,
} from '@/types/Ingredient'
import { positiveFloatValidation } from '@/utils/validate'
import { ValidationData, ValidationErrorPayload } from '@/types/default'

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
        kcalAmount: '1',
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
    let errors: ValidationErrorPayload[] = []

    if (!form.unit) {
        errors = [...errors, { name: 'unit', description: 'Nie znaleziono' }]
    }
    if (form.name === '') {
        errors = [...errors, { name: 'name', description: 'Błędna nazwa' }]
    }
    if (form.unit && !units.includes(form.unit)) {
        errors = [...errors, { name: 'unit', description: 'Zła jednostka' }]
    }
    if (form.oppositeUnit && !units.includes(form.oppositeUnit as Unit)) {
        errors = [...errors, { name: 'oppositeUnit', description: 'Zła jednostka' }]
    }
    if (form.foodGroup && !foodGroups.includes(form.foodGroup as FoodGroup)) {
        errors = [...errors, { name: 'foodGroup', description: 'Zła grupa jedzenia' }]
    }
    const floatVariables: ValidationData[] = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'kcal', value: form.kcal },
        { name: 'kcalAmount', value: form.kcalAmount },
    ]
    floatVariables.forEach((variable) => {
        if (variable.value && !positiveFloatValidation(variable.value)) {
            errors = [...errors, { name: variable.name, description: 'Błędna wartość' }]
        }
    })

    const costVariables = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
    ].filter((data) => data.value)
    const conversionVariables: ValidationData[] = [
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'oppositeUnit', value: form.oppositeUnit as string },
    ].filter((data) => data.value)
    const kcalVariables = [
        { name: 'kcal', value: form.kcal },
        { name: 'kcalAmount', value: form.kcalAmount },
    ].filter((data) => data.value)

    const missingCostVariables = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
    ].filter((data) => !data.value)
    const missingConversionVariables: ValidationData[] = [
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'oppositeUnit', value: form.oppositeUnit as string },
    ].filter((data) => !data.value)
    const missingKcalVariables = [
        { name: 'kcal', value: form.kcal },
        { name: 'kcalAmount', value: form.kcalAmount },
    ].filter((data) => !data.value)

    if (missingCostVariables.length === 1) {
        errors = [
            ...errors,
            {
                name: missingCostVariables[0].name,
                description: 'Brakuje wartości do wyliczenia kosztu',
            },
        ]
    }

    if (
        missingConversionVariables.length === 1 ||
        missingConversionVariables.length === 2
    ) {
        missingConversionVariables.forEach((missingVairable) => {
            errors = [
                ...errors,
                {
                    name: missingVairable.name,
                    description: 'Brakuje wartości do wyliczenia konwerzji',
                },
            ]
        })
    }

    if (missingKcalVariables.length === 1) {
        errors = [
            ...errors,
            {
                name: missingKcalVariables[0].name,
                description: 'Brakuje wartości do wyliczenia kcal',
            },
        ]
    }

    if (errors.length) {
        throw new ValidationError(`Napraw błędne pola`, errors)
    }
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
        kcal: kcalVariables.length
            ? parseFloat(kcalVariables[0].value!) /
              (parseFloat(kcalVariables[1].value!) *
                  measurements[form.unit as keyof typeof measurements])
            : undefined,
        foodGroup: (form.foodGroup as FoodGroup) ?? 'inne',
    }
}

export const formToPatchIngredientDTO = (
    form: IngredientFormData
): PatchIngredientDTO => {
    let errors: ValidationErrorPayload[] = []
    if (!form.id) {
        errors = [...errors, { name: 'id', description: 'Nie znaleziono' }]
    }

    if (!form.unit) {
        errors = [...errors, { name: 'unit', description: 'Nie znaleziono' }]
    }
    if (form.name === '') {
        errors = [...errors, { name: 'name', description: 'Błędna nazwa' }]
    }
    if (form.unit && !units.includes(form.unit)) {
        errors = [...errors, { name: 'unit', description: 'Zła jednostka' }]
    }
    if (form.oppositeUnit && !units.includes(form.oppositeUnit as Unit)) {
        errors = [...errors, { name: 'oppositeUnit', description: 'Zła jednostka' }]
    }
    if (form.foodGroup && !foodGroups.includes(form.foodGroup as FoodGroup)) {
        errors = [...errors, { name: 'foodGroup', description: 'Zła grupa jedzenia' }]
    }

    const floatVariables: ValidationData[] = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'kcal', value: form.kcal },
        { name: 'kcalAmount', value: form.kcalAmount },
    ]
    floatVariables.forEach((variable) => {
        if (variable.value && !positiveFloatValidation(variable.value)) {
            errors = [...errors, { name: variable.name, description: 'Błędna wartość' }]
        }
    })

    const costVariables = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
    ].filter((data) => data.value)
    const conversionVariables: ValidationData[] = [
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'oppositeUnit', value: form.oppositeUnit as string },
    ].filter((data) => data.value)
    const kcalVariables = [
        { name: 'kcal', value: form.kcal },
        { name: 'kcalAmount', value: form.kcalAmount },
    ].filter((data) => data.value)

    const missingCostVariables = [
        { name: 'cost', value: form.cost },
        { name: 'costAmount', value: form.costAmount },
    ].filter((data) => !data.value)
    const missingConversionVariables: ValidationData[] = [
        { name: 'amount', value: form.amount },
        { name: 'oppositeAmount', value: form.oppositeAmount },
        { name: 'oppositeUnit', value: form.oppositeUnit as string },
    ].filter((data) => !data.value)
    const missingKcalVariables = [
        { name: 'kcal', value: form.kcal },
        { name: 'kcalAmount', value: form.kcalAmount },
    ].filter((data) => !data.value)

    if (missingCostVariables.length === 1) {
        errors = [
            ...errors,
            {
                name: missingCostVariables[0].name,
                description: 'Brakuje wartości do wyliczenia kosztu',
            },
        ]
    }

    if (missingConversionVariables.length === 1 || conversionVariables.length === 2) {
        missingConversionVariables.forEach((missingVairable) => {
            errors = [
                ...errors,
                {
                    name: missingVairable.name,
                    description: 'Brakuje wartości do wyliczenia konwerzji',
                },
            ]
        })
    }

    if (missingKcalVariables.length === 1) {
        errors = [
            ...errors,
            {
                name: missingKcalVariables[0].name,
                description: 'Brakuje wartości do wyliczenia kcal',
            },
        ]
    }

    if (errors.length) {
        throw new ValidationError(`Napraw błędne pola`, errors)
    }
    return {
        id: form.id!,
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
                : costVariables.length
                  ? parseFloat(
                        (
                            (parseFloat(costVariables[0].value!) *
                                measurements[form.unit as keyof typeof measurements]) /
                            (parseFloat(costVariables[1].value!) *
                                measurements[
                                    form.oppositeUnit as keyof typeof measurements
                                ])
                        ).toFixed(3)
                    )
                  : undefined,
        kcal: kcalVariables.length
            ? parseFloat(kcalVariables[0].value!) /
              (parseFloat(kcalVariables[1].value!) *
                  measurements[form.unit as keyof typeof measurements])
            : undefined,
        foodGroup: form.foodGroup as FoodGroup,
    }
}
