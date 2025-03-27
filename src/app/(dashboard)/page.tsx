'use client'

import { Box, Divider, List, Paper, Stack, Tab, Tabs, Typography } from '@mui/material'
import { autoHideDuration } from '@/constants/general'
import { Grid } from '@mui/system'
import { UUID } from 'crypto'
import { GetRecipeDTO } from '@/types/Recipe'
import { IngredientAmount, IngredientSum } from '@/types/Ingredient'
import { createSelectedRecipeStructure } from '@/app/(dashboard)/utils'
import { useEffect, useState } from 'react'
import { SelectedRecipeList } from '@/app/(dashboard)/components/SelectedRecipeList'
import { useNotifications } from '@toolpad/core'
import { IngredientList } from '@/app/(dashboard)/components/IngredientList'
import { RecipeList } from '@/app/(dashboard)/components/RecipeList'
import { getRecipes } from '@/services/recipeService'
import { getSession } from '@/utils/session'
import { Spinner } from '@/components/Spinner'

export type SelectedRecipes = {
    [id: UUID]: {
        amount: number
        name: string
        ingredients: IngredientAmount[]
    }
}

const Dashboard = () => {
    const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipes>({})
    const [recipes, setRecipes] = useState<GetRecipeDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [calcTab, setCalcTab] = useState(0)
    const toast = useNotifications()
    const { sum, ingredients }: IngredientSum = {
        sum: 0,
        ingredients: [
            {
                ingredient: {
                    id: '0-8-8-7-6',
                    name: 'Jajka',
                    type: 'amount',
                },
                amount: 5,
                unit: 'szt.',
            },
        ],
    } //TODO: calculateIngredients()

    useEffect(() => {
        getRecipes(getSession())
            .then((newRecipes) => {
                setRecipes(() => newRecipes)
                setSelectedRecipes(() => createSelectedRecipeStructure(newRecipes))
            })
            .catch((e) =>
                toast.show(`Problem z załadowaniem przepisów: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration,
                })
            )
            .finally(() => setLoading(false))
    }, [toast])

    const addRecipe = (id: UUID) => {
        setSelectedRecipes((prev) => ({
            ...prev,
            [id]: { ...prev[id], amount: prev[id].amount + 1 },
        }))
    }

    const removeRecipe = (id: UUID) => {
        setSelectedRecipes((prev) => ({
            ...prev,
            [id]: { ...prev[id], amount: prev[id].amount - 1 },
        }))
    }

    return (
        <Grid container spacing={2} margin={2}>
            <Grid
                container
                spacing={2}
                size={8}
                style={{
                    maxHeight: '86vh',
                    overflow: 'auto',
                    padding: '2rem 0.5rem 2rem 2rem',
                }}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <RecipeList
                        recipes={recipes}
                        selectedRecipes={selectedRecipes}
                        onAddClick={addRecipe}
                        onRemoveClick={removeRecipe}
                    />
                )}
            </Grid>

            <Grid style={{ minHeight: '86vh' }} size={4}>
                <Paper sx={{ height: '100%' }}>
                    <Stack
                        direction="column"
                        padding={2}
                        sx={{
                            height: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box>
                            <Tabs value={calcTab} onChange={(_e, tab) => setCalcTab(tab)}>
                                <Tab label="Przepisy" />
                                <Tab label="Składniki" />
                            </Tabs>
                            <Divider />
                        </Box>

                        {loading ? (
                            <Spinner />
                        ) : (
                            <List style={{ height: '68vh', overflow: 'auto' }}>
                                {!Object.values(selectedRecipes).filter(
                                    (recipe) => !!recipe.amount
                                ).length ? (
                                    <Typography>{'Wybierz przepisy po lewej'}</Typography>
                                ) : calcTab === 1 ? (
                                    <IngredientList ingredients={ingredients} />
                                ) : (
                                    <SelectedRecipeList recipes={selectedRecipes} />
                                )}
                            </List>
                        )}

                        <Box>
                            <Divider sx={{ marginBottom: '1rem' }} />
                            <Typography variant="h4">{`Suma: ${sum} zł`}</Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Dashboard
