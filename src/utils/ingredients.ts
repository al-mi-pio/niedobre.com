import {
    CreateIngredientDTO,
    Ingredient,
    IngredientFormData,
    PatchIngredientDTO,
} from '@/types/Ingredient'

// TODO
export const ingredientToForm = (ingredient: Ingredient): IngredientFormData => {
    return {
        id: ingredient.id,
        name: ingredient.name,
        kcal: ingredient.kcal,
    }
}

// TODO
export const formToCreateIngredientDTO = (
    form: IngredientFormData
): CreateIngredientDTO => {
    return {
        name: form.name,
        type: 'mass',
    }
}

// TODO
export const formToPatchIngredientDTO = (
    form: IngredientFormData
): PatchIngredientDTO => {
    if (!form.id) {
        throw new Error('id')
    }
    return {
        id: form.id,
    }
}
