import { IngredientAmount, IngredientIdAmount } from './Ingredient'
import { Dispatch, SetStateAction } from 'react'
import { FormTabProps } from '@/types/default'
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

export type RecipeFormIngredient = {
    id: UUID
    amount?: string
    unit?: string
}

export type Picture = {
    id?: UUID
    file: File
}

export type RecipeFormData = {
    id?: UUID
    name: string
    description?: string
    instructions?: string
    pictures?: Picture[]
    selectedIngredients?: UUID[]
    ingredients?: RecipeFormIngredient[]
    cost?: string
    isPublic?: boolean
    publicResources?: (typeof publicResources)[]
    isNew?: boolean
}

export interface RecipeFormTabProps extends FormTabProps {
    setHoveredErroredField: Dispatch<SetStateAction<keyof RecipeFormData | undefined>>
    recipeForm: RecipeFormData
}
