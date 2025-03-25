import { Ingredient } from '@/types/Ingredient'

// TODO
export const ingredientToForm = (ingredient: Ingredient) => {
    return {
        id: ingredient.id,
        name: ingredient.name,
        kcal: ingredient.kcal,
    }
}
