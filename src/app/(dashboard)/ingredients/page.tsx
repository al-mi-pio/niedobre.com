'use client'

import {
    DialogContentText,
    DialogTitle,
    Button,
    DialogContent,
    DialogActions,
    Dialog,
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
} from '@/utils/ingredients'
import { Grid } from '@mui/system'
import { autoHideDuration } from '@/constants/general'
import { emptyForm, massUnits, newForm, volumeUnits } from '@/constants/ingredients'
import { Ingredient, IngredientFormData, MassUnit } from '@/types/Ingredient'
import { ChangeEvent, useEffect, useState } from 'react'
import { IngredientSelectableList } from '@/app/(dashboard)/ingredients/components/IngredientSelectableList'
import { selectOutOfScope } from '@/app/(dashboard)/ingredients/utils'
import { useNotifications } from '@toolpad/core'
import { IngredientForm } from '@/app/(dashboard)/ingredients/components/IngredientForm'
import { getSession } from '@/utils/session'
import { Spinner } from '@/components/Spinner'

const Ingredients = () => {
    const toast = useNotifications()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
    const [ingredientForm, setIngredientForm] = useState<IngredientFormData>(emptyForm)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const oppositeUnits = massUnits.includes(ingredientForm.unit as MassUnit)
        ? volumeUnits
        : massUnits

    const handleOnClose = () => {
        setSelectedIngredient(null)
        setIngredientForm(emptyForm)
    }

    const handleOnNew = () => {
        setSelectedIngredient(null)
        setIngredientForm(newForm)
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIngredientForm((prevForm) => ({
            ...prevForm,
            oppositeUnit: selectOutOfScope(prevForm) ? '' : prevForm.oppositeUnit,
            costAmount: e.target.name === 'amount' ? e.target.value : prevForm.costAmount,
            [e.target.name]: e.target.value,
        }))
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
            // TODO: Add errors handling
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            toast.show(`Problem`, {
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
            if (selectedIngredient?.id)
                await deleteIngredient(selectedIngredient?.id, session)

            loadIngredients()
            // TODO: Add errors handling
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            toast.show(`Problem`, {
                severity: 'error',
                autoHideDuration,
            })
            setLoading(false)
        }
    }

    const loadIngredients = () => {
        getIngredients(getSession())
            .then((newIngredients) => setIngredients(() => newIngredients))
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
                        onClick={(ingredient) => setSelectedIngredient(ingredient)}
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
                    />
                )}
            </Grid>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>{`Usunąć ${selectedIngredient?.name}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`Czy aby napewno chcesz usunąć składnik o nazwie ${selectedIngredient?.name}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)}>{'Nie'}</Button>
                    <Button onClick={handleDelete} autoFocus>
                        {'Tak'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default Ingredients

// TODO: try to find a fix for "Blocked aria-hidden on an element because its descendant retained focus."
