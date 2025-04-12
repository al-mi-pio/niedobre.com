import { massUnits, volumeUnits } from '@/constants/ingredients'
import { RecipeFormIngredient } from '@/types/Recipe'
import { Ingredient } from '@/types/Ingredient'
import { UUID } from 'crypto'

export const createIngredientDropdownStructure = (ingredients: Ingredient[]) =>
    ingredients.length
        ? ingredients.reduce(
              (prev, ingredient) => ({
                  ...prev,
                  [ingredient.id]: ingredient.name,
              }),
              {
                  [ingredients[0].id]: ingredients[0].name,
              }
          )
        : {}

export const createIngredientRowsStructure = (
    ingredientIds: UUID[],
    ingredients?: RecipeFormIngredient[]
) =>
    ingredientIds.map((id) => {
        if (!ingredients) return { id }
        return ingredients.find((ingredient) => ingredient.id === id) ?? { id }
    })

export const getIngredientAvailableUnits = (ingredient?: Ingredient) => {
    if (!ingredient) return []
    if (ingredient.conversion && ingredient.type !== 'amount')
        return [...massUnits, ...volumeUnits]
    if (!ingredient.conversion && ingredient.type === 'mass') return massUnits
    if (!ingredient.conversion && ingredient.type === 'volume') return volumeUnits
    return ['szt.']
}
