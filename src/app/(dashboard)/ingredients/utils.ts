import { IngredientFormData, MassUnit, VolumeUnit } from '@/types/Ingredient'
import { massUnits, volumeUnits } from '@/constants/ingredients'

export const selectOutOfScope = (form: IngredientFormData) => {
    return (
        (massUnits.includes(form.unit as MassUnit) &&
            massUnits.includes(form.oppositeUnit as MassUnit)) ||
        (volumeUnits.includes(form.unit as VolumeUnit) &&
            volumeUnits.includes(form.oppositeUnit as VolumeUnit))
    )
}
