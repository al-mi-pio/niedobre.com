import { Dispatch, SetStateAction } from 'react'
import { FormTabProps } from '@/types/default'
import { UUID } from 'crypto'
import {
    foodGroups,
    ingredientTypes,
    massUnits,
    volumeUnits,
} from '@/constants/ingredients'

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

export type NutrientValues = {
    [Field in keyof Omit<MissingValues, 'cost'>]?: string
}

export type MissingValues = {
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

export interface IngredientFormTabProps extends FormTabProps {
    setHoveredErroredField?: Dispatch<
        SetStateAction<keyof IngredientFormData | undefined>
    >
    hoveredErroredField?: string
    oppositeUnits?: typeof massUnits | typeof volumeUnits
    ingredientForm: IngredientFormData
}
