import { Ingredient } from '@/types/Ingredients'

export const baseIngredients: Omit<Ingredient, 'id'>[] = [
    {
        name: 'sól',
        type: 'mass',
        conversion: 0.651,
        kcal: 0,
    },
]
