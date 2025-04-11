import { Ingredient } from '@/types/Ingredient'

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
