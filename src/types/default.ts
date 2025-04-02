import { IngredientFormData } from '@/types/Ingredient'

export type ValidationErrorPayload = {
    [Field in keyof IngredientFormData]?: string
}

export type ValidationData = { name: string; value: string | undefined }
