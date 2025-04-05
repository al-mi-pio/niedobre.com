import { IngredientFormData } from '@/types/Ingredient'

export const ingredientTypes = ['volume', 'mass', 'amount'] as const

export const massUnits = ['g', 'dg', 'kg'] as const

export const volumeUnits = ['L', 'mL', 'łyż.', 'łyżecz.', 'szkl.'] as const

export const units = [...massUnits, ...volumeUnits, 'szt.'] as const

export const foodGroups = [
    'owoce',
    'warzywa',
    'orzechy',
    'nabiał',
    'mięso',
    'słodkie',
    'pieczywo',
    'tłuszcze',
    'inne',
] as const

export const emptyForm: IngredientFormData = { name: '' }
export const newForm: IngredientFormData = { name: '', foodGroup: 'inne', isNew: true }
