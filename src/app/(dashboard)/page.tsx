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
import { IngredientAmount, IngredientSum, NutrientValues } from '@/types/Ingredient'
import {
    createSelectedRecipeStructure,
    missingIngredientAndNutritionalValues,
} from '@/app/(dashboard)/utils'
import { calculateIngredients, calculateNutrients } from '@/utils/conversion'
import { use, useEffect, useState } from 'react'
import { SelectedRecipeList } from '@/app/(dashboard)/components/SelectedRecipeList'
import { useNotifications } from '@toolpad/core'
import { IngredientList } from '@/app/(dashboard)/components/IngredientList'
import { PropertiesList } from '@/app/(dashboard)/components/PropertiesList'
import { AuthContext } from '@/contexts/Auth'
import { RecipeList } from '@/app/(dashboard)/components/RecipeList'
import { getRecipes } from '@/services/recipeService'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
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
    const [properties, setProperties] = useState<NutrientValues>({})
    const [recipes, setRecipes] = useState<GetRecipeDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [calcTab, setCalcTab] = useState(0)
    const [{ sum, ingredients }, setIngredientSum] = useState<IngredientSum>({
        sum: '0',
        ingredients: [],
    })
    const missingIngredientValues = missingIngredientAndNutritionalValues(ingredients)
    const router = useRouter()
    const toast = useNotifications()
    const user = use(AuthContext)

    useEffect(() => {
        calculateNutrients(selectedRecipes, user?.login ?? '').then((result) => {
            if ('errorType' in result) {
                toast.show(result.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            } else setProperties(result)
        })

        calculateIngredients(selectedRecipes, user?.login ?? '').then((result) => {
            if ('errorType' in result)
                toast.show(result.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            else setIngredientSum(result)
        })
    }, [selectedRecipes, toast, user?.login])

    useEffect(() => {
        const session = getSession()
        if ('errorType' in session) {
            router.push('/login?reason=expired')
            return
        }

        getRecipes(session)
            .then((newRecipes) => {
                if ('errorType' in newRecipes) {
                    if (newRecipes.errorType === 'SessionError')
                        router.push('/login?reason=expired')
                    else
                        toast.show(newRecipes.message, {
                            severity: 'error',
                            autoHideDuration,
                        })
                } else {
                    setRecipes(() => newRecipes ?? [])
                    setSelectedRecipes(() =>
                        createSelectedRecipeStructure(newRecipes ?? [])
                    )
                }
            })
            .catch((e) =>
                toast.show(e.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            )
            .finally(() => setLoading(false))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                                    <Typography p={2}>
                                        {'Wybierz przepisy po lewej'}
                                    </Typography>
                                ) : calcTab === 1 ? (
                                    ingredients.length ? (
                                        <IngredientList ingredients={ingredients} />
                                    ) : (
                                        <Typography p={2}>{'Brak składników'}</Typography>
                                    )
                                ) : calcTab === 2 ? (
                                    Object.values(properties).some((p) => p) ? (
                                        <PropertiesList
                                            properties={properties}
                                            missingIngredientValues={
                                                missingIngredientValues
                                            }
                                        />
                                    ) : (
                                        <Typography p={2}>
                                            {'Brak właściwości'}
                                        </Typography>
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
                                {missingIngredientValues.cost && (
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
