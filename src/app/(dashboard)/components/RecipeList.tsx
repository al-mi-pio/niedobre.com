import Link from 'next/link'
import { RecipeCard } from '@/app/(dashboard)/components/RecipeCard'
import { Typography, useTheme } from '@mui/material'
import { Grid } from '@mui/system'
import { UUID } from 'crypto'
import { GetRecipeDTO } from '@/types/Recipe'
import { SelectedRecipes } from '@/app/(dashboard)/page'

export interface RecipeListProps {
    recipes: GetRecipeDTO[]
    selectedRecipes: SelectedRecipes
    onAddClick: (recipeId: UUID) => void
    onRemoveClick: (recipeId: UUID) => void
}

export const RecipeList = ({
    recipes,
    selectedRecipes,
    onAddClick,
    onRemoveClick,
}: RecipeListProps) => {
    const theme = useTheme()
    return (
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
            {!recipes.length && (
                <Typography>
                    {'Brak przepisów, dodaj je '}
                    <Link
                        href="/recipes"
                        style={{
                            color: theme.palette.primary.main,
                            textDecoration: 'underline',
                        }}
                    >
                        {'tutaj'}
                    </Link>
                </Typography>
            )}
        </>
    )
}
