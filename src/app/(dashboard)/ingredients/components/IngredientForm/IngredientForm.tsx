import {
    Alert,
    Box,
    Tab,
    Tabs,
    Stack,
    Paper,
    Button,
    Divider,
    Typography,
    IconButton,
    SelectChangeEvent,
} from '@mui/material'
import { massUnits, volumeUnits } from '@/constants/ingredients'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import { Ingredient, IngredientFormData } from '@/types/Ingredient'
import { ValidationError } from '@/errors/ValidationError'
import { ChangeEvent, useState } from 'react'
import { AdvancedTab } from '@/app/(dashboard)/ingredients/components/IngredientForm/AdvancedTab'
import { MainTab } from '@/app/(dashboard)/ingredients/components/IngredientForm/MainTab'

interface IngredientFormProps {
    selectedIngredient: Ingredient | null
    ingredientForm: IngredientFormData
    oppositeUnits: typeof massUnits | typeof volumeUnits
    onInputChange: (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => void
    onDelete: () => void
    onClose: () => void
    errors: ValidationError | null
    onSave: () => Promise<void>
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
    const [ingredientTab, setIngredientTab] = useState(0)
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

                <Box>
                    <Tabs
                        value={ingredientTab}
                        onChange={(_e, tab) => setIngredientTab(tab)}
                    >
                        <Tab label="Główne" />
                        <Tab label="Zaawansowane" />
                    </Tabs>
                    <Divider />
                </Box>

                {!!errors && <Alert severity="error">{errors.message}</Alert>}

                {ingredientTab === 1 ? (
                    <AdvancedTab
                        ingredientForm={ingredientForm}
                        onInputChange={onInputChange}
                        errors={errors}
                    />
                ) : (
                    <MainTab
                        setHoveredErroredField={setHoveredErroredField}
                        hoveredErroredField={hoveredErroredField}
                        oppositeUnits={oppositeUnits}
                        ingredientForm={ingredientForm}
                        onInputChange={onInputChange}
                        errors={errors}
                    />
                )}

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
