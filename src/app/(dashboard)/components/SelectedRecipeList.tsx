import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { SelectedRecipes } from '@/app/(dashboard)/page'

export const SelectedRecipeList = ({ recipes }: { recipes: SelectedRecipes }) =>
    Object.entries(recipes).map(
        ([id, recipe]) =>
            !!recipe.amount && (
                <ListItem key={id}>
                    <ListItemAvatar>
                        <Avatar>
                            <MenuBookIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={recipe.name}
                        secondary={`Ilość: x${recipe.amount}`}
                    />
                </ListItem>
            )
    )
