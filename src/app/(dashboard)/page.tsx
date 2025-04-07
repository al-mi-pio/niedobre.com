'use client'

import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import {
    Box,
    Divider,
    IconButton,
    List,
    Paper,
    Stack,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from '@mui/material'
import { autoHideDuration } from '@/constants/general'
import { Grid } from '@mui/system'
import { UUID } from 'crypto'
import { GetRecipeDTO } from '@/types/Recipe'
import { IngredientAmount, IngredientSum, MissingValues } from '@/types/Ingredient'
import { calculateIngredients, calculateNutrients } from '@/utils/conversion'
import { createSelectedRecipeStructure } from '@/app/(dashboard)/utils'
import { useEffect, useState } from 'react'
import { SelectedRecipeList } from '@/app/(dashboard)/components/SelectedRecipeList'
import { useNotifications } from '@toolpad/core'
import { IngredientList } from '@/app/(dashboard)/components/IngredientList'
import { PropertiesList } from '@/app/(dashboard)/components/PropertiesList'
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

const missingIngredientAndNutritionalValues = (
    ingredients: IngredientAmount[]
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

const Dashboard = () => {
    const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipes>({})
    const [recipes, setRecipes] = useState<GetRecipeDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [calcTab, setCalcTab] = useState(0)
    const { sum, ingredients }: IngredientSum = calculateIngredients(selectedRecipes)
    const properties = calculateNutrients(selectedRecipes)
    const toast = useNotifications()

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
                                <Tab label="Właściwości" />
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
                                ) : calcTab === 2 ? (
                                    !!properties.kcal ? (
                                        <PropertiesList properties={properties} />
                                    ) : (
                                        <Typography>{'Brak właściwości'}</Typography>
                                    )
                                ) : (
                                    <SelectedRecipeList recipes={selectedRecipes} />
                                )}
                            </List>
                        )}

                        <Box>
                            <Divider sx={{ marginBottom: '1rem' }} />
                            <Stack direction="row" spacing={1}>
                                <Typography variant="h4">{`Suma: ${sum} zł`}</Typography>
                                {missingIngredientAndNutritionalValues(ingredients) && (
                                    <Tooltip
                                        title="Co najmniej jeden ze składników nie posiada ceny. Suma może być niedokładna"
                                        placement="top"
                                    >
                                        <IconButton>
                                            <WarningRoundedIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Dashboard
