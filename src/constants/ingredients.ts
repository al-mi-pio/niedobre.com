import { IngredientFormData } from '@/types/Ingredient'

export const ingredientTypes = ['volume', 'mass', 'amount'] as const

export const massUnits = ['g', 'dg', 'kg'] as const

export const volumeUnits = ['L', 'mL', 'łyż.', 'łyżecz.', 'szkl.'] as const

export const units = [...massUnits, ...volumeUnits, 'szt.'] as const

export const foodGroups = [
    'owoc',
    'warzywo',
    'zboże',
    'białko',
    'nabiał',
    'tłuszcz',
    'węglowodany',
    'inne',
] as const

export const emptyForm: IngredientFormData = { name: '' }
export const newForm: IngredientFormData = { name: '', isNew: true }
