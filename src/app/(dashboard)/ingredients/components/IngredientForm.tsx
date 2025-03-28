import {
    TextField,
    Box,
    Button,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    Typography,
} from '@mui/material'
import { massUnits, units, volumeUnits } from '@/constants/ingredients'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { Ingredient, IngredientFormData } from '@/types/Ingredient'
import { ChangeEvent, useState } from 'react'
import { selectOutOfScope } from '@/app/(dashboard)/ingredients/utils'

interface IngredientFormProps {
    selectedIngredient: Ingredient | null
    ingredientForm: IngredientFormData
    oppositeUnits: typeof massUnits | typeof volumeUnits
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSave: () => Promise<void>
    onDelete: () => void
    onClose: () => void
}

const validateIngredientForm = (form: IngredientFormData) => {
    // TODO: Proper validation
    return !!form.name && !!form.unit
}

export const IngredientForm = ({
    selectedIngredient,
    ingredientForm,
    oppositeUnits,
    onInputChange,
    onSave,
    onDelete,
    onClose,
}: IngredientFormProps) => {
    const [saving, setSaving] = useState(false)

    const handleSave = () => {
        setSaving(true)
        onSave().then(() => setSaving(false))
    }

    return (
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
                                onClick={onDelete}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}

                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Stack>
                <TextField
                    required
                    label="Nazwa"
                    value={ingredientForm.name ?? ''}
                    name="name"
                    onChange={onInputChange}
                />

                <TextField
                    select
                    required
                    label="Jednostka bazowa"
                    value={ingredientForm.unit ?? ''}
                    name="unit"
                    sx={{ width: '22ch' }}
                    onChange={onInputChange}
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
                            onChange={onInputChange}
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
                                onChange={onInputChange}
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
                                onChange={onInputChange}
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
                    onChange={onInputChange}
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
                        onChange={onInputChange}
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
                        onChange={onInputChange}
                        sx={{ width: '12ch' }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">{'zł'}</InputAdornment>
                                ),
                            },
                        }}
                    />
                </Stack>
                <Button
                    onClick={handleSave}
                    disabled={!validateIngredientForm(ingredientForm)}
                    loading={saving}
                    variant="contained"
                    sx={{ marginTop: 'auto' }}
                >
                    {'Zapisz'}
                </Button>
            </Stack>
        </Paper>
    )
}
