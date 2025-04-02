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
} from '@mui/material'
import { massUnits, units, volumeUnits } from '@/constants/ingredients'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { Ingredient, IngredientFormData } from '@/types/Ingredient'
import { ValidationError } from '@/errors/ValidationError'
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
    errors: ValidationError | null
}

const validateIngredientForm = (form: IngredientFormData) => {
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
    const [hoveredErroredField, setHoveredErroredField] = useState<
        keyof IngredientFormData | undefined
    >(undefined)

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
                    onMouseEnter={() => setHoveredErroredField('name')}
                    onMouseLeave={() => setHoveredErroredField(undefined)}
                    slotProps={{
                        formHelperText: {
                            sx: {
                                whiteSpace: 'nowrap',
                                overflow:
                                    hoveredErroredField === 'name' ? 'visible' : 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        },
                    }}
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
                    onMouseEnter={() => setHoveredErroredField('unit')}
                    onMouseLeave={() => setHoveredErroredField(undefined)}
                    slotProps={{
                        formHelperText: {
                            sx: {
                                whiteSpace: 'nowrap',
                                overflow:
                                    hoveredErroredField === 'unit' ? 'visible' : 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        },
                    }}
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
                            onMouseEnter={() => setHoveredErroredField('amount')}
                            onMouseLeave={() => setHoveredErroredField(undefined)}
                            sx={{ width: '12ch' }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {ingredientForm.unit}
                                        </InputAdornment>
                                    ),
                                },
                                formHelperText: {
                                    sx: {
                                        whiteSpace: 'nowrap',
                                        overflow:
                                            hoveredErroredField === 'amount'
                                                ? 'visible'
                                                : 'hidden',
                                        textOverflow: 'ellipsis',
                                    },
                                },
                            }}
                        />

                        <Typography variant="body1" color="textPrimary">
                            {'jest równoważne'}
                        </Typography>

                        <Stack direction="row" spacing={1}>
                            <TextField
                                required
                                value={ingredientForm.oppositeAmount ?? ''}
                                name="oppositeAmount"
                                onChange={onInputChange}
                                error={!!errors?.payload.oppositeAmount}
                                helperText={errors?.payload.oppositeAmount}
                                onMouseEnter={() =>
                                    setHoveredErroredField('oppositeAmount')
                                }
                                onMouseLeave={() => setHoveredErroredField(undefined)}
                                sx={{ width: '8ch' }}
                                slotProps={{
                                    formHelperText: {
                                        sx: {
                                            width: '8ch',
                                            whiteSpace: 'nowrap',
                                            overflow:
                                                hoveredErroredField === 'oppositeAmount'
                                                    ? 'visible'
                                                    : 'hidden',
                                            textOverflow: 'ellipsis',
                                        },
                                    },
                                }}
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
                                onMouseEnter={() =>
                                    setHoveredErroredField('oppositeUnit')
                                }
                                onMouseLeave={() => setHoveredErroredField(undefined)}
                                sx={{ width: 'fit-content', maxWidth: '11ch' }}
                                onChange={onInputChange}
                                slotProps={{
                                    formHelperText: {
                                        sx: {
                                            whiteSpace: 'nowrap',
                                            overflow:
                                                hoveredErroredField === 'oppositeUnit'
                                                    ? 'visible'
                                                    : 'hidden',
                                            textOverflow: 'ellipsis',
                                            visibility:
                                                hoveredErroredField !==
                                                    'oppositeAmount' ||
                                                !errors?.payload.oppositeAmount
                                                    ? 'visible'
                                                    : 'hidden',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={undefined}>---</MenuItem>
                                {oppositeUnits.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
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
                        onMouseEnter={() => setHoveredErroredField('kcalAmount')}
                        onMouseLeave={() => setHoveredErroredField(undefined)}
                        sx={{ width: '12ch' }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {ingredientForm.unit}
                                    </InputAdornment>
                                ),
                            },
                            formHelperText: {
                                sx: {
                                    whiteSpace: 'nowrap',
                                    overflow:
                                        hoveredErroredField === 'kcalAmount'
                                            ? 'visible'
                                            : 'hidden',
                                    textOverflow: 'ellipsis',
                                },
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
                        onMouseEnter={() => setHoveredErroredField('kcal')}
                        onMouseLeave={() => setHoveredErroredField(undefined)}
                        sx={{ width: '12ch' }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {'kcal'}
                                    </InputAdornment>
                                ),
                            },
                            formHelperText: {
                                sx: {
                                    whiteSpace: 'nowrap',
                                    overflow:
                                        hoveredErroredField === 'kcal'
                                            ? 'visible'
                                            : 'hidden',
                                    textOverflow: 'ellipsis',
                                    visibility:
                                        hoveredErroredField !== 'kcalAmount' ||
                                        ingredientForm.kcalAmount
                                            ? 'visible'
                                            : 'hidden',
                                },
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
                        onMouseEnter={() => setHoveredErroredField('costAmount')}
                        onMouseLeave={() => setHoveredErroredField(undefined)}
                        sx={{ width: '12ch' }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {ingredientForm.unit}
                                    </InputAdornment>
                                ),
                            },
                            formHelperText: {
                                sx: {
                                    whiteSpace: 'nowrap',
                                    overflow:
                                        hoveredErroredField === 'costAmount'
                                            ? 'visible'
                                            : 'hidden',
                                    textOverflow: 'ellipsis',
                                },
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
                        error={!!errors?.payload.cost}
                        helperText={errors?.payload.cost}
                        onMouseEnter={() => setHoveredErroredField('cost')}
                        onMouseLeave={() => setHoveredErroredField(undefined)}
                        sx={{ width: '12ch' }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">{'zł'}</InputAdornment>
                                ),
                            },
                            formHelperText: {
                                sx: {
                                    whiteSpace: 'nowrap',
                                    overflow:
                                        hoveredErroredField === 'cost'
                                            ? 'visible'
                                            : 'hidden',
                                    textOverflow: 'ellipsis',
                                    visibility:
                                        hoveredErroredField !== 'costAmount' ||
                                        ingredientForm.costAmount
                                            ? 'visible'
                                            : 'hidden',
                                },
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
            </Stack>
        </Paper>
    )
}
