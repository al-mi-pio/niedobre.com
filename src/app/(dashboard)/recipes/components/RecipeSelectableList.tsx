import { GetRecipeDTO } from '@/types/Recipe'
import { UUID } from 'crypto'
import { Grid } from '@mui/system'
import { Paper, Stack } from '@mui/material'
import { SearchField } from '@/components/SearchField'
import { useState } from 'react'
import {
    NewRecipeCard,
    RecipeSelectableCard,
} from '@/app/(dashboard)/recipes/components/RecipeSelectableCard'

interface Props {
    recipes: GetRecipeDTO[]
    onClick: (recipe: GetRecipeDTO) => void
    selectedRecipeId?: UUID
    onNew: () => void
}

export const RecipeSelectableList = ({
    recipes,
    onClick,
    selectedRecipeId,
    onNew,
}: Props) => {
    const [filterInput, setFilterInput] = useState<string>('')
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(filterInput.toLowerCase())
    )

    return (
        <Paper variant="outlined" sx={{ width: '100%' }}>
            <Stack sx={{ padding: '1em 15em' }}>
                <SearchField
                    value={filterInput}
                    onChange={(e) => setFilterInput(() => e.target.value)}
                />
            </Stack>
            <Grid
                container
                spacing={2}
                style={{
                    height: '74vh',
                    overflow: 'auto',
                    padding: '2rem 0.5rem 2rem 2rem',
                }}
            >
                <Grid size={4}>
                    <NewRecipeCard onNew={onNew} />
                </Grid>
                {filteredRecipes.map((recipe) => (
                    <Grid key={recipe.id} size={4}>
                        <RecipeSelectableCard
                            recipe={recipe}
                            onClick={() => onClick(recipe)}
                            selected={selectedRecipeId === recipe.id}
                        />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    )
}
