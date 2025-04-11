import Link from 'next/link'
import { ChipDropdown } from '@/components/ChipDropdown'
import { createIngredientDropdownStructure } from '@/app/(dashboard)/recipes/utils'
import { RecipeFormTabProps } from '@/types/Recipe'
import { Ingredient } from '@/types/Ingredient'
import { UUID } from 'crypto'
import { Typography } from '@mui/material'

interface Props extends RecipeFormTabProps {
    ingredients: Ingredient[]
}

export const IngredientsTab = ({
    recipeForm,
    onInputChange,
    errors,
    setHoveredErroredField,
    ingredients,
}: Props) => {
    if (!ingredients.length)
        return (
            <Typography>
                {'Brak składników, dodaj je '}
                <Link href="/ingredients">{'tutaj'}</Link>
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
                helperText={errors?.payload.selectedIngredients}
                onMouseEnter={() => setHoveredErroredField('selectedIngredients')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
                noChips
            />
        </>
    )
}
