import {
    GetRecipeDTO,
    RecipeFormData,
    RecipeFormIngredient,
    RecipeFormTabProps,
} from '@/types/Recipe'
import { Ingredient } from '@/types/Ingredient'
import { UUID } from 'crypto'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { MenuItem, Stack, Typography, TextField, useTheme } from '@mui/material'
import {
    createIngredientDropdownStructure,
    getIngredientAvailableUnits,
} from '@/app/(dashboard)/recipes/utils'
import { ChipDropdown } from '@/components/ChipDropdown'
import Link from 'next/link'

interface Props extends RecipeFormTabProps {
    ingredients: (Ingredient | GetRecipeDTO)[]
    onRowChange: (id: UUID, name: 'amount' | 'unit', value?: string) => void
}

export const IngredientsTab = ({
    recipeForm,
    onInputChange,
    errors,
    hoveredErroredField,
    setHoveredErroredField,
    ingredients,
    onRowChange,
}: Props) => {
    const theme = useTheme()
    if (!ingredients.length)
        return (
            <Typography>
                {'Brak składników, dodaj je '}
                <Link
                    href="/ingredients"
                    style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'underline',
                    }}
                >
                    {'tutaj'}
                </Link>
            </Typography>
        )
    return (
        <>
            <ChipDropdown
                label="Składniki"
                id="selectedIngredients"
                elements={createIngredientDropdownStructure(ingredients)}
                isChecked={(elem) =>
                    recipeForm.selectedIngredients
                        ? recipeForm.selectedIngredients.includes(elem as UUID)
                        : false
                }
                value={recipeForm.selectedIngredients ?? []}
                name="selectedIngredients"
                onChange={onInputChange}
                error={!!errors?.payload.selectedIngredients}
                helperText={errors?.payload.selectedIngredients as string}
                onMouseEnter={() => setHoveredErroredField('selectedIngredients')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
                noChips
            />
            <Stack
                spacing={2}
                sx={{ maxHeight: '25em', overflow: 'auto', paddingTop: '0.5em' }}
            >
                {recipeForm.ingredients?.map(({ id, amount, unit }) => (
                    <Stack
                        key={id}
                        direction="row"
                        spacing={3}
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <FiberManualRecordIcon sx={{ fontSize: '10px' }} />

                        <Typography sx={{ width: '24ch' }}>
                            {ingredients.find((i) => i.id === id)?.name}
                        </Typography>

                        <TextField
                            required
                            label="Ilość"
                            name={`ingredients.${id}.amount`}
                            value={amount ?? ''}
                            onChange={(e) => onRowChange(id, 'amount', e.target.value)}
                            error={
                                !!errors?.payload.ingredients &&
                                !!(
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id] &&
                                !!(
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id].amount
                            }
                            helperText={
                                !!errors?.payload.ingredients &&
                                !!(
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id] &&
                                (
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id].amount
                            }
                            onMouseEnter={() =>
                                setHoveredErroredField(
                                    `ingredients.${id}.amount` as keyof RecipeFormData
                                )
                            }
                            onMouseLeave={() => setHoveredErroredField(undefined)}
                            sx={{ width: '10ch' }}
                            slotProps={{
                                formHelperText: {
                                    sx: {
                                        whiteSpace: 'nowrap',
                                    },
                                },
                            }}
                        />

                        <TextField
                            select
                            required
                            label="Jednostka"
                            name={`ingredients.${id}.unit`}
                            value={unit ?? ''}
                            onChange={(e) => onRowChange(id, 'unit', e.target.value)}
                            error={
                                !!errors?.payload.ingredients &&
                                !!(
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id] &&
                                !!(
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id].unit
                            }
                            helperText={
                                !!errors?.payload.ingredients &&
                                !!(
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id] &&
                                (
                                    errors?.payload.ingredients as {
                                        [id: UUID]: RecipeFormIngredient
                                    }
                                )[id].unit
                            }
                            onMouseEnter={() =>
                                setHoveredErroredField(
                                    `ingredients.${id}.unit` as keyof RecipeFormData
                                )
                            }
                            onMouseLeave={() => setHoveredErroredField(undefined)}
                            sx={{ width: '14ch' }}
                            slotProps={{
                                formHelperText: {
                                    sx: {
                                        whiteSpace: 'nowrap',
                                        overflow:
                                            hoveredErroredField === 'unit'
                                                ? 'visible'
                                                : 'hidden',
                                        textOverflow: 'ellipsis',
                                    },
                                },
                            }}
                        >
                            {getIngredientAvailableUnits(
                                ingredients.find((ingredient) => ingredient.id === id)
                            ).map((unit) => (
                                <MenuItem key={unit} value={unit}>
                                    {unit}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                ))}
            </Stack>
        </>
    )
}
