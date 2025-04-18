import AddIcon from '@mui/icons-material/Add'
import { unknownRecipeImage } from '@/constants/recipes'
import {
    Card,
    CardMedia,
    Typography,
    CardContent,
    CardActionArea,
    Paper,
    Tooltip,
} from '@mui/material'
import { GetRecipeDTO } from '@/types/Recipe'

interface Props {
    recipe: GetRecipeDTO
    selected: boolean
    onClick: () => void
}

export const RecipeSelectableCard = ({ recipe, selected, onClick }: Props) => {
    return (
        <Card>
            <Tooltip title="Wybierz przepis">
                <CardActionArea
                    onClick={onClick}
                    data-active={selected || undefined}
                    sx={{
                        '&[data-active]': {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                                backgroundColor: 'action.selectedHover',
                            },
                            '& p::after': {
                                backgroundColor: '#424242',
                                backgroundImage: 'none',
                            },
                        },
                    }}
                >
                    <CardMedia
                        sx={{ height: 145 }}
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
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                lineHeight: '1.4rem',
                                height: '2.8rem',
                                overflow: 'hidden',
                                paddingRight: '0.5rem',
                                '&::before': {
                                    content: '"..."',
                                    position: 'absolute',
                                    bottom: '1rem',
                                    right: '1rem',
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    right: '0.8rem',
                                    width: '1rem',
                                    height: '3rem',
                                    backgroundColor: 'background.paper',
                                    backgroundImage: 'var(--mui-overlays-1)',
                                },
                            }}
                        >
                            {recipe.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Tooltip>
        </Card>
    )
}

export const NewRecipeCard = ({ onNew }: { onNew: () => void }) => {
    return (
        <Tooltip title="Dodaj przepis">
            <Paper variant="outlined">
                <Card raised>
                    <CardActionArea sx={{ height: 260 }} onClick={onNew}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AddIcon sx={{ fontSize: '100px' }} />
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Paper>
        </Tooltip>
    )
}
