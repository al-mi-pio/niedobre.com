import {
    CardActions,
    Card,
    CardMedia,
    Typography,
    CardContent,
    ToggleButton,
} from '@mui/material'
import { newRecipeImage, unknownRecipeImage } from '@/constants/recipes'
import { GetRecipeDTO } from '@/types/Recipe'

interface Props {
    recipe: GetRecipeDTO
    selected: boolean
    onClick: () => void
}

export const RecipeSelectableCard = ({ recipe, selected, onClick }: Props) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={
                    recipe.pictures && recipe.pictures[0]
                        ? `/pictures/${recipe.pictures[0]}`
                        : unknownRecipeImage
                }
                title="Recipe image"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {recipe.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {recipe.description}
                </Typography>
            </CardContent>
            <CardActions>
                <ToggleButton value="check" onChange={onClick} selected={selected}>
                    {selected ? 'Wybrano' : 'Wybierz'}
                </ToggleButton>
            </CardActions>
        </Card>
    )
}

export const NewRecipeCard = ({ onNew }: { onNew: () => void }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia sx={{ height: 140 }} image={newRecipeImage} title="New recipe" />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {'Nowy przepis'}
                </Typography>
            </CardContent>
            <CardActions>
                <ToggleButton value="new" onChange={onNew}>
                    {'Dodaj'}
                </ToggleButton>
            </CardActions>
        </Card>
    )
}
