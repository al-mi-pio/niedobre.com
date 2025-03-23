'use client'

import { Grid } from '@mui/system'
import { useNotifications } from '@toolpad/core'
import { ChangeEvent, useEffect, useState } from 'react'
import { Spinner } from '@/components/Spinner'
import {
    Avatar,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    MenuItem,
    Paper,
    Stack,
    TextField,
} from '@mui/material'
import EggIcon from '@mui/icons-material/Egg'
import { getSession } from '@/utils/session'
import { autoHideDuration } from '@/constants/general'
import { Ingredient, MassUnit, Unit, VolumeUnit } from '@/types/Ingredient'
import { getIngredients } from '@/services/ingredientService'
import { ingredientToForm } from '@/utils/ingredients'
import { units } from '@/constants/ingredients'

export type IngredientForm = {
    id?: string
    name: string
    amount?: number
    oppositeAmount?: number
    cost?: number
    kcal?: number
} & (
    | {
          unit?: MassUnit
          oppositeUnit?: VolumeUnit
      }
    | {
          unit?: VolumeUnit
          oppositeUnit?: MassUnit
      }
    | {
          unit?: 'szt.'
          oppositeUnit?: Omit<Unit, 'szt.'>
      }
)

const Ingredients = () => {
    const toast = useNotifications()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
    const [ingredientForm, setIngredientForm] = useState<IngredientForm>({ name: '' })
    const [loading, setLoading] = useState(true)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIngredientForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }))
    }

    useEffect(() => {
        const handleIngredientGet = async () => {
            const newIngredients = await getIngredients(getSession())
            setIngredients(() => newIngredients)
        }

        handleIngredientGet()
            .catch((e) =>
                toast.show(`Problem z załadowaniem składników: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration,
                })
            )
            .finally(() => setLoading(false))
    }, [toast])

    useEffect(() => {
        if (selectedIngredient)
            setIngredientForm(() => ingredientToForm(selectedIngredient))
    }, [selectedIngredient])

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
                    <List style={{ height: '68vh', overflow: 'auto' }}>
                        {ingredients.map((ingredient) => (
                            <ListItemButton
                                key={ingredient.id}
                                onClick={() => setSelectedIngredient(ingredient)}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <EggIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={ingredient.name} />
                            </ListItemButton>
                        ))}
                    </List>
                )}
            </Grid>

            <Grid style={{ minHeight: '86vh' }} size={4}>
                {!!selectedIngredient && (
                    <Paper sx={{ height: '100%' }}>
                        <Stack
                            direction="column"
                            padding={4}
                            spacing={4}
                            sx={{
                                height: '100%',
                            }}
                        >
                            <TextField
                                required
                                label="Nazwa"
                                value={ingredientForm.name}
                                name="name"
                                onChange={handleInputChange}
                            />

                            <TextField
                                select
                                label="Jednostka bazowa"
                                value={ingredientForm.unit}
                                name="unit"
                                onChange={handleInputChange}
                            >
                                {units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                label="Wartość kaloryczna"
                                value={ingredientForm.kcal}
                                name="kcal"
                                onChange={handleInputChange}
                                //endAdornment={<InputAdornment position="end">kg</InputAdornment>}
                            />
                        </Stack>
                    </Paper>
                )}
            </Grid>
        </Grid>
    )
}

export default Ingredients
