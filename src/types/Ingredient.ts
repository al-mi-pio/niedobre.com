import {
    foodGroups,
    ingredientTypes,
    massUnits,
    volumeUnits,
} from '@/constants/ingredients'
import { UUID } from 'crypto'

export type IngredientType = (typeof ingredientTypes)[number]
export type MassUnit = (typeof massUnits)[number]
export type VolumeUnit = (typeof volumeUnits)[number]
export type Unit = MassUnit | VolumeUnit | 'szt.'
export type FoodGroup = (typeof foodGroups)[number]

export type Ingredient = {
    id: UUID
    name: string
    type: IngredientType
    cost?: number
    conversion?: number
    foodGroup: FoodGroup
    kcal?: number
    protein?: number
    fat?: number
    carbohydrates?: number
    salt?: number
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
    sum: string
    ingredients: IngredientAmount[]
}

export type CreateIngredientDTO = {
    name: string
    type: IngredientType
    cost?: number
    conversion?: number
    foodGroup?: FoodGroup
    kcal?: number
    protein?: number
    fat?: number
    carbohydrates?: number
    salt?: number
}

export type PatchIngredientDTO = {
    id: UUID
    name?: string
    type?: IngredientType
    cost?: number
    conversion?: number
    foodGroup?: FoodGroup
    kcal?: number
    protein?: number
    fat?: number
    carbohydrates?: number
    salt?: number
}

export type IngredientFormData = {
    id?: UUID
    name: string
    amount?: string
    oppositeAmount?: string
    costAmount?: string
    cost?: string
    foodGroup?: string
    nutrientAmount?: string
    kcal?: string
    protein?: string
    fat?: string
    carbohydrates?: string
    salt?: string
    isNew?: boolean
} & IngredientFormDataUnits

export type IngredientFormDataUnits =
    | {
          unit?: MassUnit
          oppositeUnit?: VolumeUnit
      }
    | {
          unit?: VolumeUnit
          oppositeUnit?: MassUnit
      }
    | {
          unit?: 'szt.'
          oppositeUnit?: Omit<Unit, 'szt.'>
      }

export type nutrientValues = {
    [Field in keyof Omit<missingValues, 'cost'>]?: number
}

export type missingValues = {
    [Field in keyof Omit<
        IngredientFormData,
        | 'id'
        | 'name'
        | 'amount'
        | 'oppositeAmount'
        | 'costAmount'
        | 'foodGroup'
        | 'isNew'
        | 'unit'
        | 'oppositeUnit'
        | 'nutrientAmount'
    >]?: boolean
}
