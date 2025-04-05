import { IngredientAmount } from '@/types/Ingredient'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import IngredientIcon from '@/app/(dashboard)/ingredients/components/IngredientIcon'

export const IngredientList = ({ ingredients }: { ingredients: IngredientAmount[] }) =>
    ingredients.map(
        ({ ingredient, amount, unit }, id) =>
            !!amount && (
                <ListItem key={id}>
                    <ListItemAvatar>
                        <Avatar>
                            <IngredientIcon group={ingredient.foodGroup} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={ingredient.name}
                        secondary={`Ilość: ${amount} ${unit}`}
                    />
                </ListItem>
            )
    )
