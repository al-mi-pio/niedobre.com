import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { IngredientAmount, IngredientIdAmount } from './Ingredient'
import { SelectChangeEvent } from '@mui/material'
import { ValidationError } from '@/errors/ValidationError'
import { UUID } from 'crypto'
import { publicResources } from '@/constants/recipes'

export type PublicResources = [] | ['name', (typeof publicResources)[number]]
export type Recipe = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    pictures?: string[]
    ingredients: IngredientIdAmount[]
    cost?: number
    publicResources: PublicResources
}

export type GetRecipeDTO = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    pictures?: string[]
    ingredients: IngredientAmount[]
    cost?: number
    publicResources: PublicResources
}

export type CreateRecipeDTO = {
    name: string
    description?: string
    instructions?: string
    ingredients: IngredientIdAmount[]
    cost?: number
}

export type PatchRecipeDTO = {
    id: UUID
    name?: string
    description?: string
    instructions?: string
    pictures?: string[]
    ingredients?: IngredientIdAmount[]
    cost?: number
    publicResources?: PublicResources
}

export type PublicRecipe = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    pictures?: string[]
    ingredients?: IngredientIdAmount[]
    cost?: number
}

export type RecipeFormData = {
    id?: UUID
    name: string
    description?: string
    instructions?: string
    pictures?: string[]
    ingredients?: {
        id?: UUID
        amount?: string
        unit?: string
    }[]
    cost?: string
    isPublic?: boolean
    publicResources?: (typeof publicResources)[]
    isNew?: boolean
}

export interface RecipeFormTabProps {
    recipeForm: RecipeFormData
    onInputChange: (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => void
    errors: ValidationError | null
    hoveredErroredField?: string
    setHoveredErroredField: Dispatch<SetStateAction<keyof RecipeFormData | undefined>>
}
