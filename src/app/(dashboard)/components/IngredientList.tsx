import { IngredientAmount } from '@/types/Ingredient'
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import EggIcon from '@mui/icons-material/Egg'

export const IngredientList = ({ ingredients }: { ingredients: IngredientAmount[] }) =>
    ingredients.map(
        ({ ingredient, amount, unit }, id) =>
            !!amount && (
                <ListItem key={id}>
                    <ListItemAvatar>
                        <Avatar>
                            <EggIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={ingredient.name}
                        secondary={`Ilość: ${amount} ${unit}`}
                    />
                </ListItem>
            )
    )
