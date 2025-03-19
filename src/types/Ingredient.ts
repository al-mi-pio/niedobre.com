import { UUID } from 'crypto'
export type IngredientType = 'volume' | 'mass' | 'amount'
export type MassUnit = 'g' | 'dg' | 'kg'
export type VolumeUnit = 'L' | 'mL' | 'łyż.' | 'łyżecz.' | 'szkl.'
export type Unit = MassUnit | VolumeUnit | 'szt.'

export type Ingredient = {
    id: UUID
    name: string
    type: IngredientType
    cost?: number
    conversion?: number
    kcal?: number
}

export type IngredientAmount = {
    ingredient: Ingredient
    amount: number
    unit: Unit
}

export type IngredientIdAmount = {
    id: UUID
    amount: number
    unit: Unit
}

export type IngredientSum = {
    sum?: number
    ingredients: IngredientAmount[]
}

export type CreateIngredientDTO = {
    name: string
    type: IngredientType
    cost?: number
    conversion?: number
    kcal?: number
}

export type PatchIngredientDTO = {
    id: UUID
    name?: string
    type?: IngredientType
    cost?: number
    conversion?: number
    kcal?: number
}
