import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import {
    Typography,
    IconButton,
    Divider,
    Button,
    Paper,
    Stack,
    Tabs,
    Box,
    Tab,
    Alert,
    SelectChangeEvent,
} from '@mui/material'
import { GetRecipeDTO, RecipeFormData } from '@/types/Recipe'
import { ValidationError } from '@/errors/ValidationError'
import { ChangeEvent, useState } from 'react'
import { MainForm } from '@/app/(dashboard)/recipes/components/RecipeForm/MainForm'

interface RecipeFormProps {
    selectedRecipe: GetRecipeDTO | null
    recipeForm: RecipeFormData
    onInputChange: (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => void
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
    const [recipeTab, setRecipeTab] = useState(0)
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

                <Box>
                    <Tabs value={recipeTab} onChange={(_e, tab) => setRecipeTab(tab)}>
                        <Tab label="Główne" />
                        <Tab label="Składniki" />
                        <Tab label="Zdjęcia" />
                    </Tabs>
                    <Divider />
                </Box>

                {!!errors && <Alert severity="error">{errors.message}</Alert>}

                {recipeTab === 1 ? null : (
                    <MainForm
                        recipeForm={recipeForm}
                        onInputChange={onInputChange}
                        errors={errors}
                        hoveredErroredField={hoveredErroredField}
                        setHoveredErroredField={setHoveredErroredField}
                    />
                )}

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
