'use client'

import {
    DialogContentText,
    DialogTitle,
    ListItem,
    Button,
    List,
    Dialog,
    ListItemIcon,
    ListItemText,
    DialogContent,
    DialogActions,
} from '@mui/material'
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
import { autoHideDuration } from '@/constants/general'
import { emptyForm, massUnits, newForm, volumeUnits } from '@/constants/ingredients'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { Ingredient, IngredientFormData, MassUnit } from '@/types/Ingredient'
import { ValidationError } from '@/errors/ValidationError'
import { SessionError } from '@/errors/SessionError'
import { DataError } from '@/errors/DataError'
import { ChangeEvent, useEffect, useState } from 'react'
import { IngredientSelectableList } from '@/app/(dashboard)/ingredients/components/IngredientSelectableList'
import { selectOutOfScope } from '@/app/(dashboard)/ingredients/utils'
import { useNotifications } from '@toolpad/core'
import { IngredientForm } from '@/app/(dashboard)/ingredients/components/IngredientForm'
import { getSession } from '@/utils/session'
import { Spinner } from '@/components/Spinner'

const Ingredients = () => {
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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIngredientForm((prevForm) => {
            const newForm = {
                ...prevForm,
                oppositeUnit: selectOutOfScope(prevForm) ? '' : prevForm.oppositeUnit,
                costAmount:
                    e.target.name === 'amount' ? e.target.value : prevForm.costAmount,
                kcalAmount:
                    e.target.name === 'amount' ? e.target.value : prevForm.kcalAmount,
                [e.target.name]: e.target.value,
            } as IngredientFormData
            if (errors) {
                try {
                    if (selectedIngredient) formToPatchIngredientDTO(newForm)
                    else formToCreateIngredientDTO(newForm)

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
            const session = getSession()
            if (selectedIngredient)
                await patchIngredient(formToPatchIngredientDTO(ingredientForm), session)
            else
                await createIngredient(formToCreateIngredientDTO(ingredientForm), session)

            setLoading(true)
            loadIngredients()
        } catch (e) {
            if (e instanceof ValidationError) {
                setErrors(e)
            } else if (e instanceof DataError) {
                toast.show(e.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            } else {
                console.log(e)
                toast.show('Wystąpił nieznany problem', {
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
            if (selectedIngredient?.id) {
                const recipes = await safeIngredientDeletion(
                    selectedIngredient.id,
                    session,
                    !!recipesWithIngredient.length
                )
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
        } catch (e) {
            if (e instanceof DataError || e instanceof SessionError) {
                toast.show(e.message, {
                    severity: 'error',
                    autoHideDuration,
                })
            } else {
                console.log(e)
                toast.show('Wystąpił nieznany problem', {
                    severity: 'error',
                    autoHideDuration,
                })
            }
            setLoading(false)
        }
    }

    const loadIngredients = () => {
        getIngredients(getSession())
            .then((newIngredients) =>
                setIngredients(() =>
                    newIngredients.toSorted((a, b) => (a.name > b.name ? 1 : -1))
                )
            )
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

            {recipesWithIngredient.length ? (
                <Dialog open={modalOpen} onClose={handleModalClose}>
                    <DialogTitle>{`${selectedIngredient?.name} jest w użyciu`}</DialogTitle>

                    <DialogContent dividers>
                        <DialogContentText>{`Składnik o nazwie ${selectedIngredient?.name} jest używany w następujących przepisach: `}</DialogContentText>
                        <List>
                            {recipesWithIngredient.map((ingredient, i) => (
                                <ListItem key={i}>
                                    <ListItemIcon>
                                        <FiberManualRecordIcon
                                            sx={{ fontSize: '10px' }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={ingredient} />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>

                    <DialogContent sx={{ overflowY: 'visible' }}>
                        <DialogContentText>
                            {'Czy zezwalasz na usunięcie go z tych przepisów?'}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleModalClose}>{'Nie'}</Button>
                        <Button onClick={handleDelete} autoFocus>
                            {'Tak'}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <Dialog open={modalOpen} onClose={handleModalClose}>
                    <DialogTitle>{`Usunąć ${selectedIngredient?.name}?`}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {`Czy aby napewno chcesz usunąć składnik o nazwie ${selectedIngredient?.name}?`}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleModalClose}>{'Nie'}</Button>
                        <Button onClick={handleDelete} autoFocus>
                            {'Tak'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Grid>
    )
}

export default Ingredients
