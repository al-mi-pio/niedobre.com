import { CreateIngredientDTO, Ingredient, PatchIngredientDTO } from '@/types/Ingredient'
import { IngredientForm } from '@/app/(dashboard)/ingredients/page'

// TODO
export const ingredientToForm = (ingredient: Ingredient): IngredientForm => {
    return {
        id: ingredient.id,
        name: ingredient.name,
        kcal: ingredient.kcal,
    }
}

// TODO
export const formToCreateIngredientDTO = (form: IngredientForm): CreateIngredientDTO => {
    return {
        name: form.name,
        type: 'mass',
    }
}

// TODO
export const formToPatchIngredientDTO = (form: IngredientForm): PatchIngredientDTO => {
    if (!form.id) {
        throw new Error('id')
    }
    return {
        id: form.id,
    }
}
