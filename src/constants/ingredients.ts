export const ingredientTypes = ['volume', 'mass', 'amount'] as const

export const massUnits = ['g', 'dg', 'kg'] as const

export const volumeUnits = ['L', 'mL', 'łyż.', 'łyżecz.', 'szkl.'] as const

export const units = [...massUnits, ...volumeUnits, 'szt.'] as const
