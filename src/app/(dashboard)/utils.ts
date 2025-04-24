import { FlatIngredientAmount, MissingValues } from '@/types/Ingredient'
import { GetRecipeDTO } from '@/types/Recipe'

export const createSelectedRecipeStructure = (recipes: GetRecipeDTO[]) =>
    recipes.length
        ? recipes.reduce(
              (prev, recipe) => ({
                  ...prev,
                  [recipe.id]: {
                      amount: 0,
                      name: recipe.name,
                      ingredients: recipe.ingredients,
                  },
              }),
              {
                  [recipes[0].id]: {
                      amount: 0,
                      name: recipes[0].name,
                      ingredients: recipes[0].ingredients,
                  },
              }
          )
        : {}

export const missingIngredientAndNutritionalValues = (
    ingredients: FlatIngredientAmount[]
): MissingValues => {
    return {
        cost: ingredients.reduce(
            (prev, curr) => (prev ? true : !curr.ingredient.cost && !!curr.amount),
            false
        ),
        kcal: ingredients.reduce(
            (prev, curr) => (prev ? true : !curr.ingredient.kcal && !!curr.amount),
            false
        ),
        protein: ingredients.reduce(
            (prev, curr) => (prev ? true : !curr.ingredient.protein && !!curr.amount),
            false
        ),
        fat: ingredients.reduce(
            (prev, curr) => (prev ? true : !curr.ingredient.fat && !!curr.amount),
            false
        ),
        carbohydrates: ingredients.reduce(
            (prev, curr) =>
                prev ? true : !curr.ingredient.carbohydrates && !!curr.amount,
            false
        ),
        salt: ingredients.reduce(
            (prev, curr) => (prev ? true : !curr.ingredient.salt && !!curr.amount),
            false
        ),
    }
}
