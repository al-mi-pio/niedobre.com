'use client'

import EggIcon from '@mui/icons-material/Egg'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import RecipeCard from '@/components/RecipeCard'
import { useState, SyntheticEvent } from 'react'
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
// @ts-expect-error TODO: Use correct type
export const RecipeList = ({ recipes }) => (
    <List style={{ height: '68vh', overflow: 'auto' }}>
        {Object.entries(recipes).map(
            ([id, recipe]) =>
                // @ts-expect-error TODO: Use correct type
                !!recipe.amount && (
                    <ListItem key={id}>
                        <ListItemAvatar>
                            <Avatar>
                                <MenuBookIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            // @ts-expect-error TODO: Use correct type
                            primary={recipe.name}
                            // @ts-expect-error TODO: Use correct type
                            secondary={`Ilość: x${recipe.amount}`}
                        />
                    </ListItem>
                )
        )}
    </List>
)
// @ts-expect-error TODO: Use correct type
export const IngredientList = ({ ingredients }) => (
    <List style={{ height: '68vh', overflow: 'auto' }}>
        {ingredients.map(
            (
                {
                    // @ts-expect-error TODO: Use correct type
                    ingredient,
                    // @ts-expect-error TODO: Use correct type
                    amount,
                    // @ts-expect-error TODO: Use correct type
                    unit,
                },
                // @ts-expect-error TODO: Use correct type
                id
            ) => (
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
            )
        )}
    </List>
)

const Dashboard = () => {
    const { sum, ingredients } = {
        sum: 0,
        ingredients: [
            {
                ingredient: {
                    name: 'Jajka',
                    amount: 5,
                    unit: 'szt.',
                },
                amount: 5,
                unit: 'szt.',
            },
        ],
    } //TODO: calculateIngredients()

    const recipes = [
        {
            id: '123',
            name: 'Placek1',
            description: 'Opis placka',
            directions: '',
            picture: '/pictures/temporary_cat.png',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
    ] //TODO: await getRecipes();

    const [selectedRecipes, setSelectedRecipes] = useState(
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
            : []
    )

    const [calcTab, setCalcTab] = useState(0)

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setCalcTab(newValue)
    }

    const addRecipe = (id: string) => {
        setSelectedRecipes((prev) => ({
            ...prev,
            // @ts-expect-error TODO: Use correct type
            [id]: { ...prev[id], amount: prev[id].amount + 1 },
        }))
    }

    const removeRecipe = (id: string) => {
        setSelectedRecipes((prev) => ({
            ...prev,
            // @ts-expect-error TODO: Use correct type
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
                {recipes.map((recipe) => {
                    return (
                        <Grid key={recipe.id} size={3}>
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                // @ts-expect-error TODO: Use correct type
                                amount={selectedRecipes[recipe.id].amount}
                                onAddClick={addRecipe}
                                onRemoveClick={removeRecipe}
                            />
                        </Grid>
                    )
                })}
                {!recipes.length && (
                    <Typography>Tutaj pojawią się twoje przepisy</Typography>
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

                        {!Object.values(selectedRecipes).filter(
                            (recipe) => !!recipe.amount
                        ).length ? (
                            <Typography>{'Wybierz przepisy po lewej'}</Typography>
                        ) : calcTab === 1 ? (
                            <IngredientList ingredients={ingredients} />
                        ) : (
                            <RecipeList recipes={selectedRecipes} />
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
