import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { unknownRecipeImage } from '@/constants/recipes'
import {
    CardContent,
    Typography,
    IconButton,
    CardMedia,
    Card,
    CardActions,
} from '@mui/material'
import { GetRecipeDTO } from '@/types/Recipe'
import { UUID } from 'crypto'

export interface RecipeCardProps {
    recipe: GetRecipeDTO
    amount: number
    onAddClick: (recipeId: UUID) => void
    onRemoveClick: (recipeId: UUID) => void
}

export const RecipeCard = ({
    recipe,
    amount,
    onAddClick,
    onRemoveClick,
}: RecipeCardProps) => {
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
                <IconButton onClick={() => onAddClick(recipe.id)}>
                    <AddIcon />
                </IconButton>
                {!!amount && (
                    <>
                        <Typography variant="body1">{amount}</Typography>
                        <IconButton onClick={() => onRemoveClick(recipe.id)}>
                            <RemoveIcon />
                        </IconButton>
                    </>
                )}
            </CardActions>
        </Card>
    )
}
