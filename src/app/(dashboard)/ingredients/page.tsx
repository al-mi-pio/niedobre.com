'use client'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EggIcon from '@mui/icons-material/Egg'
import DeleteIcon from '@mui/icons-material/Delete'
import { Grid } from '@mui/system'
import { useNotifications } from '@toolpad/core'
import { ChangeEvent, useEffect, useState } from 'react'
import { Spinner } from '@/components/Spinner'
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputAdornment,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { getSession } from '@/utils/session'
import { autoHideDuration } from '@/constants/general'
import { Ingredient, MassUnit, Unit, VolumeUnit } from '@/types/Ingredient'
import {
    createIngredient,
    deleteIngredient,
    getIngredients,
    patchIngredient,
} from '@/services/ingredientService'
import {
    formToCreateIngredientDTO,
    formToPatchIngredientDTO,
    ingredientToForm,
} from '@/utils/ingredients'
import { massUnits, units, volumeUnits } from '@/constants/ingredients'
import { UUID } from 'crypto'

export type IngredientForm = {
    id?: UUID
    name: string
    amount?: number
    oppositeAmount?: number
    costAmount?: number
    cost?: number
    kcal?: number
    isNew?: boolean
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

const emptyForm: IngredientForm = { name: '' }
const newForm: IngredientForm = { name: '', isNew: true }

const validateForm = (form: IngredientForm) => {
    return !!form.name && !!form.unit
}

const selectOutOfScope = (form: IngredientForm) => {
    return (
        (massUnits.includes(form.unit as MassUnit) &&
            massUnits.includes(form.oppositeUnit as MassUnit)) ||
        (volumeUnits.includes(form.unit as VolumeUnit) &&
            volumeUnits.includes(form.oppositeUnit as VolumeUnit))
    )
}

const Ingredients = () => {
    const toast = useNotifications()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
    const [ingredientForm, setIngredientForm] = useState<IngredientForm>(emptyForm)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const oppositeUnits = massUnits.includes(ingredientForm.unit as MassUnit)
        ? volumeUnits
        : massUnits

    const [modalOpen, setModalOpen] = useState(false)

    const handleModalOpen = () => {
        setModalOpen(true)
    }

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIngredientForm((prevForm) => ({
            ...prevForm,
            oppositeUnit: selectOutOfScope(prevForm) ? '' : prevForm.oppositeUnit,
            costAmount: e.target.name === 'amount' ? e.target.value : prevForm.costAmount,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const session = getSession()
            if (selectedIngredient)
                await patchIngredient(formToPatchIngredientDTO(ingredientForm), session)
            else
                await createIngredient(formToCreateIngredientDTO(ingredientForm), session)

            setSaving(false)
            setLoading(true)
            loadIngredients()
            // TODO: Add errors handling
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            toast.show(`Problem`, {
                severity: 'error',
                autoHideDuration,
            })
        }
        setSaving(false)
    }

    const handleDelete = async () => {
        setModalOpen(false)
        setLoading(true)
        try {
            const session = getSession()
            if (selectedIngredient?.id)
                await deleteIngredient(selectedIngredient?.id, session)

            loadIngredients()
            // TODO: Add errors handling
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            toast.show(`Problem`, {
                severity: 'error',
                autoHideDuration,
            })
            setLoading(false)
        }
    }

    const handleOnClose = () => {
        setSelectedIngredient(null)
        setIngredientForm(emptyForm)
    }

    const handleOnNew = () => {
        setSelectedIngredient(null)
        setIngredientForm(newForm)
    }

    const loadIngredients = () => {
        getIngredients(getSession())
            .then((newIngredients) => setIngredients(() => newIngredients))
            .catch((e) =>
                toast.show(`Problem z załadowaniem składników: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration,
                })
            )
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadIngredients()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedIngredient)
            setIngredientForm(() => ingredientToForm(selectedIngredient))
    }, [selectedIngredient])

    return (
        <Grid
            container
            spacing={2}
            margin={2}
            style={{ justifyContent: 'center', gap: '50px' }}
        >
            <Grid
                container
                spacing={2}
                size={2}
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
                                selected={selectedIngredient?.id === ingredient.id}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <EggIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={ingredient.name} />
                            </ListItemButton>
                        ))}
                        <ListItemButton onClick={handleOnNew}>
                            <ListItemAvatar>
                                <Avatar>
                                    <AddIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Dodaj nowy składnik" />
                        </ListItemButton>
                    </List>
                )}
            </Grid>

            <Grid style={{ minHeight: '86vh' }} size={4}>
                {(!!selectedIngredient || ingredientForm.isNew) && (
                    <Paper sx={{ height: '100%' }}>
                        <Stack
                            direction="column"
                            padding={4}
                            spacing={4}
                            useFlexGap
                            sx={{
                                height: '100%',
                            }}
                        >
                            <Stack
                                direction="row"
                                sx={{
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography variant="h4">
                                    {selectedIngredient ? 'Edytuj' : 'Dodaj'}
                                </Typography>
                                <Box>
                                    {selectedIngredient && (
                                        <IconButton
                                            style={{
                                                marginRight: '10px',
                                            }}
                                            onClick={handleModalOpen}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}

                                    <IconButton onClick={handleOnClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Stack>
                            <TextField
                                required
                                label="Nazwa"
                                value={ingredientForm.name ?? ''}
                                name="name"
                                onChange={handleInputChange}
                            />

                            <TextField
                                select
                                required
                                label="Jednostka bazowa"
                                value={ingredientForm.unit ?? ''}
                                name="unit"
                                sx={{ width: '22ch' }}
                                onChange={handleInputChange}
                            >
                                {units.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {ingredientForm.unit && ingredientForm.unit !== 'szt.' && (
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        alignItems: 'center',
                                    }}
                                >
                                    <TextField
                                        required
                                        value={ingredientForm.amount ?? ''}
                                        name="amount"
                                        onChange={handleInputChange}
                                        sx={{ width: '12ch' }}
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {ingredientForm.unit}
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />

                                    <Typography variant="body1" color="textPrimary">
                                        {'jest równoważne'}
                                    </Typography>

                                    <Box>
                                        <TextField
                                            required
                                            value={ingredientForm.oppositeAmount ?? ''}
                                            name="oppositeAmount"
                                            onChange={handleInputChange}
                                            sx={{ width: '8ch' }}
                                        />

                                        <TextField
                                            select
                                            required
                                            value={
                                                ingredientForm.oppositeUnit &&
                                                !selectOutOfScope(ingredientForm)
                                                    ? ingredientForm.oppositeUnit
                                                    : ''
                                            }
                                            name="oppositeUnit"
                                            sx={{ width: 'fit-content' }}
                                            onChange={handleInputChange}
                                        >
                                            {oppositeUnits.map((unit) => (
                                                <MenuItem key={unit} value={unit}>
                                                    {unit}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Stack>
                            )}

                            <TextField
                                label="Wartość kaloryczna"
                                value={ingredientForm.kcal ?? ''}
                                name="kcal"
                                onChange={handleInputChange}
                            />

                            <Stack
                                direction="row"
                                spacing={2}
                                sx={{
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    required
                                    value={ingredientForm.costAmount ?? ''}
                                    name="costAmount"
                                    onChange={handleInputChange}
                                    sx={{ width: '12ch' }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {ingredientForm.unit}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />

                                <Typography variant="body1" color="textPrimary">
                                    {'kosztuje'}
                                </Typography>

                                <TextField
                                    required
                                    value={ingredientForm.cost ?? ''}
                                    name="cost"
                                    onChange={handleInputChange}
                                    sx={{ width: '12ch' }}
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {'zł'}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                />
                            </Stack>
                            <Button
                                onClick={handleSave}
                                disabled={!validateForm(ingredientForm)}
                                loading={saving}
                                variant="contained"
                                sx={{ marginTop: 'auto' }}
                            >
                                {'Zapisz'}
                            </Button>
                        </Stack>
                    </Paper>
                )}
            </Grid>
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>{`Usunąć ${selectedIngredient?.name}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Czy aby napewno chcesz usunąć składnik o nazwie ${selectedIngredient?.name}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose}>{'Nie'}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {'Tak'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default Ingredients

// TODO: try to find a fix for "Blocked aria-hidden on an element because its descendant retained focus."
