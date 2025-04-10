import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { RecipeFormData } from '@/types/Recipe'
import { ValidationError } from '@/errors/ValidationError'
import { SelectChangeEvent, TextField } from '@mui/material'
import { ChipDropdown } from '@/components/ChipDropdown'
import { publicResources } from '@/constants/recipes'

interface Props {
    recipeForm: RecipeFormData
    onInputChange: (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => void
    errors: ValidationError | null
    hoveredErroredField?: string
    setHoveredErroredField: Dispatch<SetStateAction<keyof RecipeFormData | undefined>>
}

export const MainForm = ({
    recipeForm,
    onInputChange,
    errors,
    hoveredErroredField,
    setHoveredErroredField,
}: Props) => (
    <>
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
                        overflow: hoveredErroredField === 'name' ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                    },
                },
            }}
        />

        <TextField
            required
            multiline
            label="Opis"
            maxRows={2}
            value={recipeForm.description ?? ''}
            name="description"
            onChange={onInputChange}
            error={!!errors?.payload.description}
            helperText={errors?.payload.description}
            onMouseEnter={() => setHoveredErroredField('description')}
            onMouseLeave={() => setHoveredErroredField(undefined)}
            slotProps={{
                formHelperText: {
                    sx: {
                        whiteSpace: 'nowrap',
                        overflow:
                            hoveredErroredField === 'description' ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                    },
                },
            }}
        />

        <TextField
            required
            multiline
            rows={4}
            label="Instrukcje"
            value={recipeForm.instructions ?? ''}
            name="instructions"
            onChange={onInputChange}
            error={!!errors?.payload.instructions}
            helperText={errors?.payload.instructions}
            onMouseEnter={() => setHoveredErroredField('instructions')}
            onMouseLeave={() => setHoveredErroredField(undefined)}
            slotProps={{
                formHelperText: {
                    sx: {
                        whiteSpace: 'nowrap',
                        overflow:
                            hoveredErroredField === 'instructions' ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                    },
                },
            }}
        />

        <ChipDropdown
            label="Parametry publiczne"
            id="publicResources"
            elements={[...publicResources]}
            isChecked={(elem) =>
                recipeForm.publicResources
                    ? recipeForm.publicResources.includes(
                          elem as keyof (typeof publicResources)[keyof typeof publicResources]
                      )
                    : false
            }
            value={recipeForm.publicResources ?? []}
            name="publicResources"
            onChange={onInputChange}
            error={!!errors?.payload.publicResources}
            helperText={errors?.payload.publicResources}
            onMouseEnter={() => setHoveredErroredField('publicResources')}
            onMouseLeave={() => setHoveredErroredField(undefined)}
        />
    </>
)
