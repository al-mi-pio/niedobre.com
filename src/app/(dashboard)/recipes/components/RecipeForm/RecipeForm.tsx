import { autoHideDuration, unknownErrorMessage } from '@/constants/general'
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
import { DataError } from '@/errors/DataError'
import { Ingredient } from '@/types/Ingredient'
import { SessionError } from '@/errors/SessionError'
import { ValidationError } from '@/errors/ValidationError'
import { GetRecipeDTO, RecipeFormData } from '@/types/Recipe'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNotifications } from '@toolpad/core'
import { IngredientsTab } from '@/app/(dashboard)/recipes/components/RecipeForm/IngredientsTab'
import { getIngredients } from '@/services/ingredientService'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { MainTab } from '@/app/(dashboard)/recipes/components/RecipeForm/MainTab'
import { Spinner } from '@/components/Spinner'

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
    const router = useRouter()
    const toast = useNotifications()
    const ignoreLoad = useRef(false)
    const [saving, setSaving] = useState(false)
    const [recipeTab, setRecipeTab] = useState(0)
    const [ingredients, setIngredients] = useState<Ingredient[] | null>(null)
    const [hoveredErroredField, setHoveredErroredField] = useState<
        keyof RecipeFormData | undefined
    >(undefined)

    const handleSave = () => {
        setSaving(true)
        onSave().then(() => setSaving(false))
    }

    const loadIngredients = async () => {
        try {
            const newIngredients = await getIngredients(getSession())
            if (!ignoreLoad.current)
                setIngredients(() =>
                    newIngredients.toSorted((a, b) => (a.name > b.name ? 1 : -1))
                )
        } catch (error) {
            if (error instanceof DataError)
                toast.show(error.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            else if (error instanceof SessionError) {
                router.push('/login?reason=expired')
            } else {
                toast.show(unknownErrorMessage, {
                    severity: 'error',
                    autoHideDuration,
                })
            }
        }
    }

    useEffect(() => {
        ignoreLoad.current = false
        loadIngredients().then()

        return () => {
            ignoreLoad.current = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!ingredients)
        return (
            <Paper sx={{ height: '100%' }}>
                <Spinner />
            </Paper>
        )

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

                {recipeTab === 1 ? (
                    <IngredientsTab
                        recipeForm={recipeForm}
                        onInputChange={onInputChange}
                        errors={errors}
                        hoveredErroredField={hoveredErroredField}
                        setHoveredErroredField={setHoveredErroredField}
                        ingredients={ingredients}
                    />
                ) : recipeTab === 2 ? null : (
                    <MainTab
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
