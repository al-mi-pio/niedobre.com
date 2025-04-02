import {
    TextField,
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    Typography,
    Popover,
} from '@mui/material'
import { massUnits, units, volumeUnits } from '@/constants/ingredients'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { Ingredient, IngredientFormData } from '@/types/Ingredient'
import { ValidationError } from '@/errors/ValidationError'
import { ChangeEvent, useState, MouseEvent } from 'react'
import { selectOutOfScope } from '@/app/(dashboard)/ingredients/utils'

interface IngredientFormProps {
    selectedIngredient: Ingredient | null
    ingredientForm: IngredientFormData
    oppositeUnits: typeof massUnits | typeof volumeUnits
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSave: () => Promise<void>
    onDelete: () => void
    onClose: () => void
    errors: ValidationError | null
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
    errors,
}: IngredientFormProps) => {
    const [saving, setSaving] = useState(false)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [popoverText, setPopoverText] = useState<string | undefined>(undefined)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, text?: string) => {
        onInputChange(e)
        setPopoverText(text)
    }

    const handlePopoverOpen = (event: MouseEvent, text?: string) => {
        setPopoverText(text)
        setAnchorEl(event.currentTarget)
    }

    const handlePopoverClose = () => {
        setAnchorEl(null)
    }

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

                {!!errors && <Alert severity="error">{errors.message}</Alert>}

                <TextField
                    required
                    label="Nazwa"
                    value={ingredientForm.name ?? ''}
                    name="name"
                    onChange={onInputChange}
                    error={!!errors?.payload.name}
                    helperText={errors?.payload.name}
                />

                <TextField
                    select
                    required
                    label="Jednostka bazowa"
                    value={ingredientForm.unit ?? ''}
                    name="unit"
                    sx={{ width: '22ch' }}
                    onChange={onInputChange}
                    error={!!errors?.payload.unit}
                    helperText={errors?.payload.unit}
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
                            error={!!errors?.payload.amount}
                            helperText={errors?.payload.amount}
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
                                error={!!errors?.payload.oppositeAmount}
                                helperText={errors?.payload.oppositeAmount}
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
                                error={!!errors?.payload.oppositeUnit}
                                helperText={errors?.payload.oppositeUnit}
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

                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        required
                        value={ingredientForm.kcalAmount ?? ''}
                        name="kcalAmount"
                        onChange={onInputChange}
                        error={!!errors?.payload.kcalAmount}
                        helperText={errors?.payload.kcalAmount}
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
                        {'ma'}
                    </Typography>

                    <TextField
                        required
                        value={ingredientForm.kcal ?? ''}
                        name="kcal"
                        onChange={onInputChange}
                        error={!!errors?.payload.kcal}
                        helperText={errors?.payload.kcal}
                        sx={{ width: '12ch' }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {'kcal'}
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Stack>

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
                        error={!!errors?.payload.costAmount}
                        helperText={errors?.payload.costAmount}
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
                        onChange={(e) => handleInputChange(e, errors?.payload.cost)}
                        error={!!errors?.payload.cost}
                        onMouseEnter={(e) => handlePopoverOpen(e, errors?.payload.cost)}
                        onMouseLeave={handlePopoverClose}
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
                    disabled={!validateIngredientForm(ingredientForm) || !!errors}
                    loading={saving}
                    variant="contained"
                    sx={{ marginTop: 'auto' }}
                >
                    {'Zapisz'}
                </Button>
                <Popover
                    sx={{ pointerEvents: 'none' }}
                    open={Boolean(anchorEl) && !!popoverText}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableAutoFocus
                >
                    <Typography sx={{ p: 1 }}>{popoverText}</Typography>
                </Popover>
            </Stack>
        </Paper>
    )
}
