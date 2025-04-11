'use client'

import { autoHideDuration, unknownErrorMessage } from '@/constants/general'
import { emptyForm, newForm } from '@/constants/recipes'
import { Grid } from '@mui/system'
import { DataError } from '@/errors/DataError'
import { SessionError } from '@/errors/SessionError'
import { ValidationError } from '@/errors/ValidationError'
import { SelectChangeEvent } from '@mui/material'
import { GetRecipeDTO, RecipeFormData } from '@/types/Recipe'
import { ChangeEvent, useEffect, useState } from 'react'
import { deleteRecipe, getRecipes } from '@/services/recipeService'
import { RecipeSelectableList } from '@/app/(dashboard)/recipes/components/RecipeSelectableList'
import { useNotifications } from '@toolpad/core'
import { RecipeModal } from '@/app/(dashboard)/recipes/components/RecipeModal'
import { RecipeForm } from '@/app/(dashboard)/recipes/components/RecipeForm/RecipeForm'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Spinner'

const Recipes = () => {
    const router = useRouter()
    const toast = useNotifications()
    const [errors, setErrors] = useState<ValidationError | null>(null)
    const [recipes, setRecipes] = useState<GetRecipeDTO[]>([])
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

    const handleInputChange = (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => {
        const event = e as ChangeEvent<HTMLInputElement>

        setRecipeForm((prevForm) => {
            const newForm = {
                ...prevForm,
                [event.target.name]:
                    event.target.type === 'checkbox'
                        ? event.target.checked
                        : event.target.value,
            } as RecipeFormData
            if (errors) {
                try {
                    //TODO:
                    // if (selectedRecipe)
                    //     formToPatchRecipeDTO(newForm)
                    // else formToCreateRecipeDTO(newForm)

                    setErrors(null)
                } catch (e) {
                    if (e instanceof ValidationError) {
                        setErrors(e)
                    }
                }
            }
            return newForm
        })
    }

    const handleSave = async () => {
        try {
            //TODO:
            // const session = getSession()
            // if (selectedRecipe)
            //     await patchRecipe(formToPatchRecipeDTO(recipeForm), session)
            // else await createRecipe(formToCreateRecipeDTO(recipeForm), session)

            setLoading(true)
            loadRecipes()
        } catch (e) {
            if (e instanceof ValidationError) {
                setErrors(e)
            } else if (e instanceof DataError) {
                toast.show(e.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            } else if (e instanceof SessionError) {
                router.push('/login?reason=expired')
            } else {
                console.log(e)
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
            .then((newRecipes) =>
                setRecipes(() =>
                    newRecipes.toSorted((a, b) => (a.name > b.name ? 1 : -1))
                )
            )
            .catch((e) =>
                toast.show(`Problem z załadowaniem przepisów: ${e.message}`, {
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
        if (selectedRecipe) setRecipeForm(() => ({ name: selectedRecipe.name })) //TODO: recipeToForm(selectedRecipe)
    }, [selectedRecipe])

    return (
        <Grid
            container
            spacing={2}
            margin={2}
            style={{ justifyContent: 'center', gap: '50px' }}
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

            <Grid style={{ minHeight: '86vh' }} size={4}>
                {(!!selectedRecipe || recipeForm.isNew) && (
                    <RecipeForm
                        selectedRecipe={selectedRecipe}
                        recipeForm={recipeForm}
                        onInputChange={handleInputChange}
                        onSave={handleSave}
                        onDelete={() => setModalOpen(true)}
                        onClose={handleOnClose}
                        errors={errors}
                    />
                )}
            </Grid>

            <RecipeModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onAction={handleDelete}
                recipeName={selectedRecipe?.name}
            />
        </Grid>
    )
}

export default Recipes
