'use client'

import EggIcon from '@mui/icons-material/Egg'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useState, SyntheticEvent, useEffect } from 'react'
import { Grid } from '@mui/system'
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material'
import { UUID } from 'crypto'
import { IngredientAmount, IngredientSum } from '@/types/Ingredient'
import { GetRecipeDTO } from '@/types/Recipe'
import { Spinner } from '@/components/Spinner'
import { RecipeCard } from '@/components/RecipeCard'
import { getRecipes } from '@/services/recipeService'
import { getSession } from '@/utils/session'
import { useNotifications } from '@toolpad/core'

export type SelectedRecipes = {
    [id: UUID]: {
        amount: number
        name: string
        ingredients: IngredientAmount[]
    }
}

export const RecipeList = ({ recipes }: { recipes: SelectedRecipes }) =>
    Object.entries(recipes).map(
        ([id, recipe]) =>
            !!recipe.amount && (
                <ListItem key={id}>
                    <ListItemAvatar>
                        <Avatar>
                            <MenuBookIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={recipe.name}
                        secondary={`Ilość: x${recipe.amount}`}
                    />
                </ListItem>
            )
    )

export const IngredientList = ({ ingredients }: { ingredients: IngredientAmount[] }) =>
    ingredients.map(({ ingredient, amount, unit }, id) => (
        <ListItem key={id}>
            <ListItemAvatar>
                <Avatar>
                    <EggIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={ingredient.name}
                secondary={`Ilość: ${amount} ${unit}`}
            />
        </ListItem>
    ))

const createSelectedRecipeStructure = (recipes: GetRecipeDTO[]) =>
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

const Dashboard = () => {
    const toast = useNotifications()
    const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipes>({})
    const [recipes, setRecipes] = useState<GetRecipeDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [calcTab, setCalcTab] = useState(0)
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
        const handleRecipeGet = async () => {
            const newRecipes = await getRecipes(getSession())
            setRecipes(() => newRecipes)
        }

        handleRecipeGet()
            .catch((e) =>
                toast.show(`Problem z załadowaniem przepisów: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration: 6000,
                })
            )
            .finally(() => setLoading(false))
    }, [toast])

    useEffect(() => {
        setSelectedRecipes(() => createSelectedRecipeStructure(recipes))
    }, [recipes])

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setCalcTab(newValue)
    }

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
                    <>
                        {recipes.map((recipe) => (
                            <Grid key={recipe.id} size={3}>
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    amount={selectedRecipes[recipe.id].amount}
                                    onAddClick={addRecipe}
                                    onRemoveClick={removeRecipe}
                                />
                            </Grid>
                        ))}
                        {!recipes.length && (
                            <Typography>{'Tutaj pojawią się twoje przepisy'}</Typography>
                        )}
                    </>
                )}
            </Grid>

            <Grid style={{ minHeight: '89vh' }} size={4}>
                <Paper sx={{ height: '100%' }}>
                    <Stack
                        direction="column"
                        padding={2}
                        sx={{
                            height: '100%',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <Tabs value={calcTab} onChange={handleChange}>
                                <Tab label="Przepisy" />
                                <Tab label="Składniki" />
                            </Tabs>
                            <Divider />
                        </div>

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
                                    <RecipeList recipes={selectedRecipes} />
                                )}
                            </List>
                        )}

                        <div>
                            <Divider sx={{ marginBottom: '1rem' }} />
                            <Typography variant="h4">{`Suma: ${sum} zł`}</Typography>
                        </div>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Dashboard
