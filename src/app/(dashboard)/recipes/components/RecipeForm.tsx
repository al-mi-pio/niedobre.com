import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import {
    Typography,
    IconButton,
    Button,
    Paper,
    Stack,
    Box,
    Alert,
    TextField,
} from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { ValidationError } from '@/errors/ValidationError'
import { GetRecipeDTO, RecipeFormData } from '@/types/Recipe'

interface RecipeFormProps {
    selectedRecipe: GetRecipeDTO | null
    recipeForm: RecipeFormData
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
    onSave: () => Promise<void>
    onDelete: () => void
    onClose: () => void
    errors: ValidationError | null
}

export const RecipeForm = ({
    selectedRecipe,
    recipeForm,
    onInputChange,
    onSave,
    onDelete,
    onClose,
    errors,
}: RecipeFormProps) => {
    const [saving, setSaving] = useState(false)
    const [hoveredErroredField, setHoveredErroredField] = useState<
        keyof RecipeFormData | undefined
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
                        {selectedRecipe ? 'Edytuj' : 'Dodaj'}
                    </Typography>
                    <Box>
                        {selectedRecipe && (
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
                    value={recipeForm.name ?? ''}
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

                <Button
                    onClick={handleSave}
                    disabled={!recipeForm.name || !!errors}
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
