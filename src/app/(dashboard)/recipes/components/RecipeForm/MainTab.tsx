import { RecipeFormTabProps } from '@/types/Recipe'
import { publicResources, publicResourcesLabels } from '@/constants/recipes'
import {
    InputAdornment,
    Stack,
    Checkbox,
    TextField,
    FormControlLabel,
} from '@mui/material'
import { ChipDropdown } from '@/components/ChipDropdown'

export const MainTab = ({
    recipeForm,
    onInputChange,
    errors,
    hoveredErroredField,
    setHoveredErroredField,
}: RecipeFormTabProps) => (
    <>
        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <TextField
                required
                label="Nazwa"
                value={recipeForm.name ?? ''}
                name="name"
                onChange={onInputChange}
                error={!!errors?.payload.name}
                helperText={errors?.payload.name as string}
                onMouseEnter={() => setHoveredErroredField('name')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
                sx={{ width: '100%' }}
                slotProps={{
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                            overflow:
                                hoveredErroredField === 'name' ? 'visible' : 'hidden',
                            textOverflow: 'ellipsis',
                        },
                    },
                }}
            />

            <TextField
                label="Cena"
                value={recipeForm.cost ?? ''}
                name="cost"
                onChange={onInputChange}
                error={!!errors?.payload.cost}
                helperText={errors?.payload.cost as string}
                onMouseEnter={() => setHoveredErroredField('cost')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
                sx={{ width: '14ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'zł'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                            overflow:
                                hoveredErroredField === 'cost' ? 'visible' : 'hidden',
                            textOverflow: 'ellipsis',
                        },
                    },
                }}
            />
        </Stack>

        <TextField
            multiline
            label="Opis"
            maxRows={2}
            value={recipeForm.description ?? ''}
            name="description"
            onChange={onInputChange}
            error={!!errors?.payload.description}
            helperText={errors?.payload.description as string}
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
            multiline
            rows={4}
            label="Instrukcje"
            value={recipeForm.instructions ?? ''}
            name="instructions"
            onChange={onInputChange}
            error={!!errors?.payload.instructions}
            helperText={errors?.payload.instructions as string}
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

        <FormControlLabel
            control={
                <Checkbox
                    checked={recipeForm.isPublic ?? false}
                    onChange={onInputChange}
                    name="isPublic"
                />
            }
            label="Udostępnij przepis"
        />

        {recipeForm.isPublic && (
            <ChipDropdown
                label="Parametry publiczne"
                id="publicResources"
                elements={publicResourcesLabels}
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
                helperText={errors?.payload.publicResources as string}
                onMouseEnter={() => setHoveredErroredField('publicResources')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
                leftMargin="2em"
            />
        )}
    </>
)
