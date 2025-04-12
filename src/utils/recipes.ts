import {
    CreateRecipeDTO,
    GetRecipeDTO,
    PatchRecipeDTO,
    RecipeFormData,
} from '@/types/Recipe'

export const recipeToForm = (recipe: GetRecipeDTO) => {
    //TODO
    return { name: recipe.name } as RecipeFormData
}

export const formToCreateRecipeDTO = (form: RecipeFormData) => {
    //TODO
    return { name: form.name, ingredients: [] } as CreateRecipeDTO
}

export const formToPatchRecipeDTO = (form: RecipeFormData) => {
    //TODO
    return { id: form.id } as PatchRecipeDTO
}
