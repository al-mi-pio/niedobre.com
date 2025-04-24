'use client'

import {
    createIngredient,
    deleteIngredient,
    getIngredients,
    patchIngredient,
} from '@/services/ingredientService'
import {
    formToCreateIngredientDTO,
    formToPatchIngredientDTO,
    ingredientToForm,
    safeIngredientDeletion,
} from '@/utils/ingredients'
import { Grid } from '@mui/system'
import { autoHideDuration, unknownErrorMessage } from '@/constants/general'
import { emptyForm, massUnits, newForm, volumeUnits } from '@/constants/ingredients'
import { Ingredient, IngredientFormData, MassUnit } from '@/types/Ingredient'
import { SelectChangeEvent } from '@mui/material'
import { ValidationError } from '@/errors/ValidationError'
import { ChangeEvent, useEffect, useState } from 'react'
import { IngredientSelectableList } from '@/app/(dashboard)/ingredients/components/IngredientSelectableList'
import { SafeDeletionModal } from '@/components/SafeDeletionModal'
import { selectOutOfScope } from '@/app/(dashboard)/ingredients/utils'
import { useNotifications } from '@toolpad/core'
import { IngredientForm } from '@/app/(dashboard)/ingredients/components/IngredientForm/IngredientForm'
import { getSession } from '@/utils/session'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Spinner'

const Ingredients = () => {
    const router = useRouter()
    const toast = useNotifications()
    const [errors, setErrors] = useState<ValidationError | null>(null)
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
    const [ingredientForm, setIngredientForm] = useState<IngredientFormData>(emptyForm)
    const [recipesWithIngredient, setRecipesWithIngredient] = useState<string[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const oppositeUnits = massUnits.includes(ingredientForm.unit as MassUnit)
        ? volumeUnits
        : massUnits

    const handleIngredientSelected = (ingredient: Ingredient | null) => {
        setSelectedIngredient(ingredient)
        setErrors(null)
    }

    const handleOnClose = () => {
        handleIngredientSelected(null)
        setIngredientForm(emptyForm)
    }

    const handleOnNew = () => {
        handleIngredientSelected(null)
        setIngredientForm(newForm)
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setTimeout(() => setRecipesWithIngredient([]), 200)
    }

    const handleInputChange = (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => {
        const event = e as ChangeEvent<HTMLInputElement>

        setIngredientForm((prevForm) => {
            const newForm = {
                ...prevForm,
                oppositeUnit: selectOutOfScope(prevForm) ? '' : prevForm.oppositeUnit,
                costAmount:
                    event.target.name === 'amount'
                        ? event.target.value
                        : prevForm.costAmount,
                [event.target.name]: event.target.value,
            } as IngredientFormData
            if (errors) {
                const result = selectedIngredient
                    ? formToPatchIngredientDTO(newForm)
                    : formToCreateIngredientDTO(newForm)

                if ('errorType' in result) setErrors(result)
                else setErrors(null)
            }
            return newForm
        })
    }

    const handleSave = async () => {
        try {
            const session = getSession()
            if ('errorType' in session) {
                router.push('/login?reason=expired')
                return
            }

            if (selectedIngredient) {
                const dto = formToPatchIngredientDTO(ingredientForm)
                if ('errorType' in dto) {
                    setErrors(dto)
                    return
                }
                const result = await patchIngredient(dto, session)
                if ('errorType' in result) {
                    if (result.errorType === 'SessionError')
                        router.push('/login?reason=expired')
                    else
                        toast.show(result.message, {
                            severity: 'error',
                            autoHideDuration,
                        })
                    return
                }
            } else {
                const dto = formToCreateIngredientDTO(ingredientForm)
                if ('errorType' in dto) {
                    setErrors(dto)
                    return
                }
                if ('errorType' in (await createIngredient(dto, session))) {
                    router.push('/login?reason=expired')
                    return
                }
            }
            setLoading(true)
            loadIngredients()
        } catch {
            toast.show(unknownErrorMessage, {
                severity: 'error',
                autoHideDuration,
            })
        }
    }

    const handleDelete = async () => {
        setModalOpen(false)
        setLoading(true)
        try {
            const session = getSession()
            if ('errorType' in session) {
                router.push('/login?reason=expired')
                return
            }

            if (selectedIngredient?.id) {
                const recipes = await safeIngredientDeletion(
                    selectedIngredient.id,
                    session,
                    !!recipesWithIngredient.length
                )
                if ('errorType' in recipes) {
                    router.push('/login?reason=expired')
                    return
                }

                if (recipes.length) {
                    setRecipesWithIngredient(recipes)
                    setLoading(false)
                    setModalOpen(true)
                    return
                }
                await deleteIngredient(selectedIngredient.id, session)
            }

            setSelectedIngredient(null)
            loadIngredients()
        } catch {
            toast.show(unknownErrorMessage, {
                severity: 'error',
                autoHideDuration,
            })
        }

        setLoading(false)
    }

    const loadIngredients = () => {
        const session = getSession()
        if ('errorType' in session) {
            router.push('/login?reason=expired')
            return
        }

        getIngredients(session)
            .then((newIngredients) => {
                if ('errorType' in newIngredients) router.push('/login?reason=expired')
                else
                    setIngredients(() =>
                        newIngredients.toSorted((a, b) => (a.name > b.name ? 1 : -1))
                    )
            })
            .catch((e) =>
                toast.show(`Problem z załadowaniem składników: ${e.message}`, {
                    severity: 'error',
                    autoHideDuration,
                })
            )
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadIngredients()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selectedIngredient)
            setIngredientForm(() => ingredientToForm(selectedIngredient))
    }, [selectedIngredient])

    return (
        <Grid
            container
            spacing={2}
            margin={2}
            style={{ justifyContent: 'center', gap: '50px' }}
        >
            <Grid
                container
                spacing={2}
                size={4}
                style={{
                    maxHeight: '86vh',
                    padding: '2rem 0.5rem 2rem 2rem',
                }}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <IngredientSelectableList
                        ingredients={ingredients}
                        selectedIngredientId={selectedIngredient?.id}
                        onClick={(ingredient) => handleIngredientSelected(ingredient)}
                        onNew={handleOnNew}
                    />
                )}
            </Grid>

            <Grid style={{ minHeight: '86vh' }} size={4}>
                {(!!selectedIngredient || ingredientForm.isNew) && (
                    <IngredientForm
                        selectedIngredient={selectedIngredient}
                        ingredientForm={ingredientForm}
                        oppositeUnits={oppositeUnits}
                        onInputChange={handleInputChange}
                        onSave={handleSave}
                        onDelete={() => setModalOpen(true)}
                        onClose={handleOnClose}
                        errors={errors}
                    />
                )}
            </Grid>

            <SafeDeletionModal
                which={recipesWithIngredient.length ? 2 : 1}
                elementName={selectedIngredient?.name}
                recipes={recipesWithIngredient}
                onClose={handleModalClose}
                onAction={handleDelete}
                elementType="składnik"
                open={modalOpen}
            />
        </Grid>
    )
}

export default Ingredients
