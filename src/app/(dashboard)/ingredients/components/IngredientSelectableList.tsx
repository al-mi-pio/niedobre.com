import { useState } from 'react'
import { SearchField } from '@/components/SearchField'
import {
    ListItemAvatar,
    ListItemText,
    List,
    Stack,
    Paper,
    Avatar,
    ListItemButton,
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
}: Props) => {
    const [filterInput, setFilterInput] = useState<string>('')
    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.includes(filterInput)
    )
    return (
        <Paper variant="outlined">
            <Stack sx={{ padding: '0.5em 5em' }}>
                <SearchField
                    value={filterInput}
                    onChange={(e) => setFilterInput(() => e.target.value)}
                />
            </Stack>

            <List
                sx={{
                    height: '68vh',
                    whiteSpace: 'nowrap',
                    overflowY: 'scroll',
                    width: '26em',
                }}
            >
                {filteredIngredients.map((ingredient) => (
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
}
