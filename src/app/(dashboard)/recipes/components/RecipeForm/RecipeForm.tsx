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
import { UUID } from 'crypto'
import { Ingredient } from '@/types/Ingredient'
import { ValidationError } from '@/errors/ValidationError'
import { GetRecipeDTO, RecipeFormData } from '@/types/Recipe'
import { ChangeEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import { useNotifications } from '@toolpad/core'
import { IngredientsTab } from '@/app/(dashboard)/recipes/components/RecipeForm/IngredientsTab'
import { getIngredients } from '@/services/ingredientService'
import { PicturesTab } from '@/app/(dashboard)/recipes/components/RecipeForm/PicturesTab'
import { getRecipes } from '@/services/recipeService'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { MainTab } from '@/app/(dashboard)/recipes/components/RecipeForm/MainTab'
import { Spinner } from '@/components/Spinner'

interface RecipeFormProps {
    selectedRecipe: GetRecipeDTO | null
    recipeForm: RecipeFormData
    onIngredientRowChange: (id: UUID, name: 'amount' | 'unit', value?: string) => void
    onInputChange: (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => void
    setRecipeForm: (value: SetStateAction<RecipeFormData>) => void
    onDelete: () => void
    onClose: () => void
    errors: ValidationError | null
    onSave: () => Promise<void>
}

export const RecipeForm = ({
    onIngredientRowChange,
    setRecipeForm,
    selectedRecipe,
    onInputChange,
    recipeForm,
    onDelete,
    onClose,
    onSave,
    errors,
}: RecipeFormProps) => {
    const router = useRouter()
    const toast = useNotifications()
    const ignoreLoad = useRef(false)
    const [saving, setSaving] = useState(false)
    const [recipeTab, setRecipeTab] = useState(0)
    const [ingredients, setIngredients] = useState<(Ingredient | GetRecipeDTO)[] | null>(
        null
    )
    const [hoveredErroredField, setHoveredErroredField] = useState<
        keyof RecipeFormData | undefined
    >(undefined)

    const handleSave = () => {
        setSaving(true)
        onSave().then(() => {
            loadIngredients().then(() => setSaving(false))
        })
    }

    const loadIngredients = async () => {
        try {
            const session = getSession()
            if ('errorType' in session) {
                router.push('/login?reason=expired')
                return
            }

            const newIngredients = await getIngredients(session)
            const recipes = await getRecipes(session)

            if ('errorType' in newIngredients || 'errorType' in recipes) {
                if (
                    ('errorType' in newIngredients &&
                        newIngredients.errorType === 'SessionError') ||
                    ('errorType' in recipes && recipes.errorType === 'SessionError')
                )
                    router.push('/login?reason=expired')
                else if ('errorType' in recipes && recipes.errorType === 'DataError')
                    toast.show(recipes.message, {
                        severity: 'error',
                        autoHideDuration,
                    })
                else
                    toast.show(unknownErrorMessage, {
                        severity: 'error',
                        autoHideDuration,
                    })
                return
            }

            if (!ignoreLoad.current)
                setIngredients(() =>
                    [...newIngredients, ...recipes].toSorted((a, b) =>
                        a.name > b.name ? 1 : -1
                    )
                )
        } catch {
            toast.show(unknownErrorMessage, {
                severity: 'error',
                autoHideDuration,
            })
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
                        onRowChange={onIngredientRowChange}
                    />
                ) : recipeTab === 2 ? (
                    <PicturesTab recipeForm={recipeForm} setRecipeForm={setRecipeForm} />
                ) : (
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
