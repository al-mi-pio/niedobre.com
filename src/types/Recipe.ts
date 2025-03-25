import { UUID } from 'crypto'
import { IngredientIdAmount, IngredientAmount } from './Ingredient'

export type PublicResources = [] | ['name', ...(keyof CreateRecipeDTO)[]]
export type Recipe = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    picture?: string
    ingredients: IngredientIdAmount[]
    cost?: number
    publicResources: PublicResources
}

export type GetRecipeDTO = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    picture?: string
    ingredients: IngredientAmount[]
    cost?: number
    publicResources: PublicResources
}

export type CreateRecipeDTO = {
    name: string
    description?: string
    instructions?: string
    picture?: string
    ingredients: IngredientIdAmount[]
    cost?: number
}

export type PatchRecipeDTO = {
    id: UUID
    name?: string
    description?: string
    instructions?: string
    picture?: string
    ingredients?: IngredientIdAmount[]
    cost?: number
    publicResources?: PublicResources
}

export type PublicRecipe = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    picture?: string
    ingredients?: IngredientIdAmount[]
    cost?: number
}
