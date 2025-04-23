'use client'

import { autoHideDuration, unknownErrorMessage } from '@/constants/general'
import { emptyForm, newForm } from '@/constants/recipes'
import { Grid } from '@mui/system'
import { UUID } from 'crypto'
import { DataError } from '@/errors/DataError'
import { SessionError } from '@/errors/SessionError'
import { ValidationError } from '@/errors/ValidationError'
import { SelectChangeEvent } from '@mui/material'
import { GetRecipeDTO, RecipeFormData } from '@/types/Recipe'
import { ChangeEvent, useEffect, useState } from 'react'
import { createIngredientRowsStructure } from '@/app/(dashboard)/recipes/utils'
import { RecipeSelectableList } from '@/app/(dashboard)/recipes/components/RecipeSelectableList'
import { useNotifications } from '@toolpad/core'
import { RecipeForm } from '@/app/(dashboard)/recipes/components/RecipeForm/RecipeForm'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Spinner'
import {
    formToCreateRecipeDTO,
    formToPatchRecipeDTO,
    safeRecipeDeletion,
    recipeToForm,
} from '@/utils/recipes'
import {
    createRecipe,
    deleteRecipe,
    getRecipes,
    patchRecipe,
} from '@/services/recipeService'
import { SafeDeletionModal } from '@/components/SafeDeletionModal'

const Recipes = () => {
    const router = useRouter()
    const toast = useNotifications()
    const [errors, setErrors] = useState<ValidationError | null>(null)
    const [recipes, setRecipes] = useState<GetRecipeDTO[]>([])
    const [recipesWithRecipe, setRecipesWithRecipe] = useState<string[]>([])
    const [selectedRecipe, setSelectedRecipe] = useState<GetRecipeDTO | null>(null)
    const [recipeForm, setRecipeForm] = useState<RecipeFormData>(emptyForm)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleRecipeSelected = (recipe: GetRecipeDTO | null) => {
        setSelectedRecipe(recipe)
        setErrors(null)
    }

    const handleOnClose = () => {
        handleRecipeSelected(null)
        setRecipeForm(emptyForm)
    }

    const handleOnNew = () => {
        handleRecipeSelected(null)
        setRecipeForm(newForm)
    }

    const handleError = (error: unknown) => {
        if (error instanceof ValidationError) {
            setErrors(error)
        } else {
            toast.show(unknownErrorMessage, {
                severity: 'error',
                autoHideDuration,
            })
        }
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setTimeout(() => setRecipesWithRecipe([]), 200)
    }

    const handleIngredientRowChange = (
        id: UUID,
        name: 'amount' | 'unit',
        value?: string
    ) => {
        setRecipeForm((prevForm) => {
            const newForm = {
                ...prevForm,
                ingredients:
                    prevForm.ingredients &&
                    prevForm.ingredients.map((ingredient) =>
                        ingredient.id === id
                            ? { ...ingredient, [name]: value }
                            : ingredient
                    ),
            } as RecipeFormData
            if (errors) {
                if (selectedRecipe)
                    formToPatchRecipeDTO(newForm)
                        .then(() => setErrors(null))
                        .catch(handleError)
                else
                    formToCreateRecipeDTO(newForm)
                        .then(() => setErrors(null))
                        .catch(handleError)
            }
            return newForm
        })
    }

    const handleInputChange = (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => {
        const event = e as ChangeEvent<HTMLInputElement>

        setRecipeForm((prevForm) => {
            const newForm = {
                ...prevForm,
                [event.target.name]:
                    event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value,
                ingredients:
                    event.target.name === 'selectedIngredients'
                        ? createIngredientRowsStructure(
                              event.target.value as unknown as UUID[],
                              recipeForm.ingredients
                          )
                        : prevForm.ingredients,
            } as RecipeFormData
            if (errors) {
                if (selectedRecipe)
                    formToPatchRecipeDTO(newForm)
                        .then(() => setErrors(null))
                        .catch(handleError)
                else
                    formToCreateRecipeDTO(newForm)
                        .then(() => setErrors(null))
                        .catch(handleError)
            }
            return newForm
        })
    }

    const handleSave = async () => {
        try {
            const session = getSession()

            if (selectedRecipe) {
                const dto = await formToPatchRecipeDTO(recipeForm)
                if (dto instanceof ValidationError) {
                    setErrors(dto)
                    return
                }
                if ((await patchRecipe(dto, session)) instanceof SessionError) {
                    router.push('/login?reason=expired')
                    return
                }
            } else {
                const dto = await formToCreateRecipeDTO(recipeForm)
                if (dto instanceof ValidationError) {
                    setErrors(dto)
                    return
                }
                if ((await createRecipe(dto, session)) instanceof SessionError) {
                    router.push('/login?reason=expired')
                    return
                }
            }

            setLoading(true)
            loadRecipes()
        } catch (e) {
            if (e instanceof SessionError) {
                router.push('/login?reason=expired')
            } else {
                toast.show(unknownErrorMessage, {
                    severity: 'error',
                    autoHideDuration,
                })
            }
        }
    }

    const handleDelete = async () => {
        setModalOpen(false)
        setLoading(true)
        try {
            const session = getSession()
            if (selectedRecipe?.id) {
                const badRecipes = await safeRecipeDeletion(
                    selectedRecipe.id,
                    session,
                    !!recipesWithRecipe.length
                )
                if (badRecipes instanceof SessionError) {
                    router.push('/login?reason=expired')
                    return
                }
                if (badRecipes.length) {
                    setRecipesWithRecipe(badRecipes)
                    setLoading(false)
                    setModalOpen(true)
                    return
                }
                await deleteRecipe(selectedRecipe.id, session)
            }

            setSelectedRecipe(null)
            loadRecipes()
        } catch (e) {
            if (e instanceof DataError) {
                toast.show(e.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            } else if (e instanceof SessionError) {
                router.push('/login?reason=expired')
            } else {
                toast.show(unknownErrorMessage, {
                    severity: 'error',
                    autoHideDuration,
                })
            }
            setLoading(false)
        }
    }

    const loadRecipes = () => {
        getRecipes(getSession())
            .then((newRecipes) => {
                if (newRecipes instanceof SessionError)
                    router.push('/login?reason=expired')
                else if (newRecipes instanceof DataError)
                    toast.show(newRecipes.message, {
                        severity: 'error',
                        autoHideDuration,
                    })
                else
                    setRecipes(() =>
                        (newRecipes ?? []).toSorted((a, b) => (a.name > b.name ? 1 : -1))
                    )
            })
            .catch((e) =>
                toast.show(e.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            )
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadRecipes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedRecipe) setRecipeForm(() => recipeToForm(selectedRecipe))
    }, [selectedRecipe])

    return (
        <Grid
            container
            spacing={2}
            margin={2}
            style={{ justifyContent: 'center', gap: '50px' }}
        >
            <Grid
                container
                size={6}
                style={{
                    maxHeight: '86vh',
                    overflow: 'clip',
                    padding: '2rem 0.5rem 2rem 2rem',
                }}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <RecipeSelectableList
                        recipes={recipes}
                        selectedRecipeId={selectedRecipe?.id}
                        onClick={handleRecipeSelected}
                        onNew={handleOnNew}
                    />
                )}
            </Grid>

            <Grid style={{ minHeight: '86vh' }} size={4}>
                {(!!selectedRecipe || recipeForm.isNew) && (
                    <RecipeForm
                        onIngredientRowChange={handleIngredientRowChange}
                        onDelete={() => setModalOpen(true)}
                        onInputChange={handleInputChange}
                        selectedRecipe={selectedRecipe}
                        setRecipeForm={setRecipeForm}
                        recipeForm={recipeForm}
                        onClose={handleOnClose}
                        onSave={handleSave}
                        errors={errors}
                    />
                )}
            </Grid>

            <SafeDeletionModal
                which={recipesWithRecipe.length ? 2 : 1}
                elementName={selectedRecipe?.name}
                recipes={recipesWithRecipe}
                onClose={handleModalClose}
                onAction={handleDelete}
                elementType="przepis"
                open={modalOpen}
            />
        </Grid>
    )
}

export default Recipes
