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
