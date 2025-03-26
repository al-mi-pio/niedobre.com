import {
    Avatar,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Paper,
} from '@mui/material'
import EggIcon from '@mui/icons-material/Egg'
import AddIcon from '@mui/icons-material/Add'
import { Ingredient } from '@/types/Ingredient'
import { UUID } from 'crypto'

interface Props {
    ingredients: Ingredient[]
    onClick: (ingredient: Ingredient) => void
    selectedIngredientId?: UUID
    onNew: () => void
}

export const IngredientSelectableList = ({
    ingredients,
    onClick,
    selectedIngredientId,
    onNew,
}: Props) => (
    <Paper variant="outlined">
        <List
            sx={{
                height: '68vh',
                whiteSpace: 'nowrap',
                overflowY: 'scroll',
                width: '26em',
            }}
        >
            {ingredients.map((ingredient) => (
                <ListItemButton
                    key={ingredient.id}
                    onClick={() => onClick(ingredient)}
                    selected={selectedIngredientId === ingredient.id}
                >
                    <ListItemAvatar>
                        <Avatar>
                            <EggIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={ingredient.name} />
                </ListItemButton>
            ))}
        </List>
        <ListItemButton onClick={onNew}>
            <ListItemAvatar>
                <Avatar>
                    <AddIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Dodaj nowy składnik" />
        </ListItemButton>
    </Paper>
)
