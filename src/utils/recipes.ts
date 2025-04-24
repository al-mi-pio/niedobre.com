import { Success, ValidationErrorPayload } from '@/types/default'
import {
    CreateRecipeDTO,
    GetRecipeDTO,
    PatchRecipeDTO,
    Picture,
    RecipeFormData,
    RecipeFormIngredient,
} from '@/types/Recipe'
import { UUID } from 'crypto'
import { positiveFloatValidation } from './validate'
import { validationError } from '@/errors/ValidationError'
import { saveImage } from './file'
import { emptyUUID } from '@/constants/general'
import { Session } from '@/types/Auth'
import { deleteRecipe, getCompressedRecipes, patchRecipe } from '@/services/recipeService'

export const recipeToForm = (recipe: GetRecipeDTO) => {
    return {
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        instructions: recipe.instructions,
        pictures: recipe.pictures?.map((picture) => ({
            id: picture.split('/')[0],
            file: picture,
        })),
        selectedIngredients: recipe.ingredients.reduce(
            (prev, curr) => [...prev, curr.ingredient.id],
            [] as UUID[]
        ),
        ingredients: recipe.ingredients.map(
            (ingredient) =>
                ({
                    id: ingredient.ingredient.id,
                    amount: ingredient.amount.toString(),
                    unit: ingredient.unit,
                }) as RecipeFormIngredient
        ),
        cost: recipe.cost,
        isPublic: !!recipe.publicResources.length,
        publicResources: recipe.publicResources.filter(
            (rescource) => rescource !== 'name'
        ),
    } as RecipeFormData
}

const validateFormData = (form: RecipeFormData) => {
    const errors: ValidationErrorPayload = {}

    if (!form.name) {
        errors['name'] = 'Pole wymagane'
    }
    if (form.cost && !positiveFloatValidation(form.cost)) {
        errors['cost'] = 'Błędna wartość'
    }

    if (!!form.ingredients) {
        form.ingredients.forEach((ingredient) => {
            const ingredientError = { amount: '', unit: '' }
            if (!ingredient.amount) {
                ingredientError.amount = 'Pole wymagane'
            }
            if (!ingredient.unit) {
                ingredientError.unit = 'Pole wymagane'
            }

            if (!!ingredient.amount && !positiveFloatValidation(ingredient.amount)) {
                ingredientError.amount = 'Błędna wartość'
            }

            if (ingredientError.amount && ingredientError.unit) {
                errors['ingredients'] = {
                    ...(errors['ingredients'] as object),
                    [ingredient.id]: {
                        amount: ingredientError.amount,
                        unit: ingredientError.unit,
                    },
                }
            } else if (ingredientError.amount) {
                errors['ingredients'] = {
                    ...(errors['ingredients'] as object),
                    [ingredient.id]: {
                        amount: ingredientError.amount,
                    },
                }
            } else if (ingredientError.unit) {
                errors['ingredients'] = {
                    ...(errors['ingredients'] as object),
                    [ingredient.id]: {
                        unit: ingredientError.unit,
                    },
                }
            }
        })
    }

    if (Object.keys(errors).length) {
        return validationError('Napraw błędne pola', errors)
    }

    return [] as Success
}

export const formToCreateRecipeDTO = async (form: RecipeFormData) => {
    form.ingredients = form.ingredients?.map((ingredient) => ({
        ...ingredient,
        amount: ingredient.amount?.replace(',', '.'),
    }))
    form.cost = form.cost?.replace(',', '.')
    const validation = validateFormData(form)
    if ('errorType' in validation) {
        return validation
    }
    const savedPictures = await Promise.all(
        form.pictures?.map(async (picture) => {
            const imageId = await saveImage(picture.file as File)
            return {
                id: imageId,
                file: `${imageId}/${(picture.file as File).name}`,
            } as Picture
        }) ?? []
    )
    return {
        name: form.name,
        description: form.description,
        instructions: form.instructions,
        pictures: savedPictures?.reduce(
            (prev, curr) => [...prev, curr.file as string],
            [] as string[]
        ),
        ingredients: !!form.ingredients
            ? form.ingredients.map((ingredient) => ({
                  id: ingredient.id,
                  amount: parseFloat(ingredient.amount!),
                  unit: ingredient.unit,
              }))
            : [],
        cost: form.cost,
        publicResources: form.isPublic
            ? ['name', ...(form.publicResources as string[])]
            : undefined,
    } as CreateRecipeDTO
}

export const formToPatchRecipeDTO = async (form: RecipeFormData) => {
    form.ingredients = form.ingredients?.map((ingredient) => ({
        ...ingredient,
        amount: ingredient.amount?.replace(',', '.'),
    }))
    form.cost = form.cost?.replace(',', '.')
    const validation = validateFormData(form)
    if ('errorType' in validation) {
        return validation
    }
    const savedPictures = await Promise.all(
        (await form.pictures?.map(async (picture) => {
            if (picture.file instanceof File) {
                const imageId = await saveImage(picture.file)
                return {
                    id: imageId,
                    file: `${imageId}/${(picture.file as File).name}`,
                }
            }
            return picture
        })) ?? []
    )
    return {
        id: form.id ?? emptyUUID,
        name: form.name,
        description: form.description,
        instructions: form.instructions,
        pictures: savedPictures?.reduce(
            (prev, curr) => [...prev, curr.file as string],
            [] as string[]
        ),
        ingredients: !!form.ingredients
            ? form.ingredients.map((ingredient) => ({
                  id: ingredient.id,
                  amount: parseFloat(ingredient.amount!),
                  unit: ingredient.unit,
              }))
            : [],
        cost: form.cost,
        publicResources: form.isPublic
            ? ['name', ...(form.publicResources as string[])]
            : [],
    } as PatchRecipeDTO
}

export const safeRecipeDeletion = async (
    recipeId: UUID,
    session: Session,
    commitDeletion?: boolean
) => {
    const recipes = await getCompressedRecipes(session)
    if ('errorType' in recipes) {
        return recipes
    }
    const recipesWithIngredients = recipes.filter(
        (recipe) =>
            recipe.ingredients.filter((ingredient) => ingredient.id === recipeId).length
    )
    if (!commitDeletion) {
        return recipesWithIngredients.reduce(
            (prev, curr) => [...prev, curr.name],
            [] as string[]
        )
    }

    recipesWithIngredients.forEach((recipe) =>
        patchRecipe(
            {
                ...recipe,
                ingredients: recipe.ingredients.filter(
                    (ingredient) => ingredient.id !== recipeId
                ),
            },
            session
        )
    )
    await deleteRecipe(recipeId, session)
    return [] as string[]
}
