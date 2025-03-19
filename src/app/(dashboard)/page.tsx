'use client'

import EggIcon from '@mui/icons-material/Egg'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import RecipeCard from '@/components/RecipeCard'
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Pagination,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
} from '@mui/material'
import { Grid } from '@mui/system'
import { useState, SyntheticEvent } from 'react'

export const RecipeList = ({ recipes }) => (
    <List style={{ height: '65vh', overflow: 'auto' }}>
        {Object.entries(recipes).map(
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
        )}
    </List>
)

export const IngredientList = ({ ingredients }) => (
    <List>
        {ingredients.map(({ name, amount, unit }, id) => (
            <ListItem key={id}>
                <ListItemAvatar>
                    <Avatar>
                        <EggIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} secondary={`Ilość: ${amount} ${unit}`} />
            </ListItem>
        ))}
    </List>
)

const Home = () => {
    const { sum, ingredients } = {
        sum: 0,
        ingredients: [
            {
                name: 'Jajka',
                amount: 5,
                unit: 'szt.',
            },
            {
                name: 'Mleko',
                amount: 400,
                unit: 'ml',
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
        {
            id: '124',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '125',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '126',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '127',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '128',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '129',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '130',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '131',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '132',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '133',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '134',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '135',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '136',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '137',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '138',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '139',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
        {
            id: '140',
            name: 'Placek2',
            ingredients: [],
            isPublic: true,
            publicResources: ['name', 'picture'],
        },
    ] //TODO: await getRecipes();

    const [selectedRecipes, setSelectedRecipes] = useState(
        recipes.reduce(
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
    )

    const [calcTab, setCalcTab] = useState(0)

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setCalcTab(newValue)
    }

    const addRecipe = (id: string) => {
        setSelectedRecipes((prev) => ({
            ...prev,
            [id]: { ...prev[id], amount: prev[id].amount + 1 },
        }))
    }

    const removeRecipe = (id: string) => {
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
                {recipes.map((recipe) => {
                    return (
                        <Grid key={recipe.id} size={3}>
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                amount={selectedRecipes[recipe.id].amount}
                                onAddClick={addRecipe}
                                onRemoveClick={removeRecipe}
                            />
                        </Grid>
                    )
                })}
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

export default Home
