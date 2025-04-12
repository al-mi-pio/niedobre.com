import { RecipeFormData } from '@/types/Recipe'

export const newRecipeImage = '/assets/new_recipe.webp'
export const unknownRecipeImage = '/assets/unknown_recipe.webp'

export const emptyForm: RecipeFormData = { name: '' }
export const newForm: RecipeFormData = { name: '', isNew: true }

export const publicResourcesLabels = {
    description: 'Opis',
    instructions: 'Instrukcje',
    ingredients: 'Składniki',
    cost: 'Cena',
}
export const publicResources = [...Object.keys(publicResourcesLabels)] as const
