import { UUID } from 'crypto'
import { IngredientIdAmount, IngredientAmount } from './Ingredient'

export type Recipe = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    picture?: string
    ingredients: IngredientIdAmount[]
    cost?: number
    publicResources:
        | ['name', 'description', 'instructions', 'picture', 'ingrediants', 'cost']
        | []
}

export type GetRecipeDTO = {
    id: UUID
    name: string
    description?: string
    instructions?: string
    picture?: string
    ingredients: IngredientAmount[]
    cost?: number
    publicResources:
        | ['name', 'description', 'instructions', 'picture', 'ingrediants', 'cost']
        | []
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
    publicResources?:
        | ['name', 'description', 'instructions', 'picture', 'ingrediants', 'cost']
        | []
}
