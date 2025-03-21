import { Grid } from '@mui/system'
import { RecipeCard } from '@/app/(dashboard)/components/RecipeCard'
import { Typography } from '@mui/material'
import { GetRecipeDTO } from '@/types/Recipe'
import { SelectedRecipes } from '@/app/(dashboard)/page'
import { UUID } from 'crypto'

export interface RecipeListProps {
    recipes: GetRecipeDTO[]
    selectedRecipes: SelectedRecipes
    onAddClick: (recipeId: UUID) => void
    onRemoveClick: (recipeId: UUID) => void
}

export const SelectedRecipeList = ({
    recipes,
    selectedRecipes,
    onAddClick,
    onRemoveClick,
}: RecipeListProps) => (
    <>
        {recipes.map((recipe) => (
            <Grid key={recipe.id} size={3}>
                <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    amount={selectedRecipes[recipe.id].amount}
                    onAddClick={onAddClick}
                    onRemoveClick={onRemoveClick}
                />
            </Grid>
        ))}
        {!recipes.length && <Typography>{'Tutaj pojawią się twoje przepisy'}</Typography>}
    </>
)
