import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import { Grid } from '@mui/system'
import {
    Card,
    Paper,
    Stack,
    CardMedia,
    Typography,
    IconButton,
    CardContent,
    CardActionArea,
    CardActions,
    useTheme,
    Tooltip,
} from '@mui/material'
import { DeleteModal } from '@/components/DeleteModal'
import { useState, ChangeEvent, SetStateAction } from 'react'
import { RecipeFormData } from '@/types/Recipe'

interface Props {
    recipeForm: RecipeFormData
    setRecipeForm: (value: SetStateAction<RecipeFormData>) => void
}

export const PicturesTab = ({ recipeForm, setRecipeForm }: Props) => {
    const theme = useTheme()
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedPicture, setSelectedPicture] = useState<{ i: number; name?: string }>({
        i: 0,
    })

    const handlePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? [...e.target.files].map((file) => ({ file })) : []
        setRecipeForm((prevForm) => ({
            ...prevForm,
            pictures: [...(prevForm.pictures ?? []), ...files],
        }))
        return e.preventDefault()
    }

    const setPictureToDefault = (index: number) => {
        setRecipeForm((prevForm) => ({
            ...prevForm,
            pictures: prevForm.pictures
                ? [
                      prevForm.pictures[index],
                      ...prevForm.pictures.filter((_, i) => i !== index),
                  ]
                : [],
        }))
    }

    const deletePicture = (index: number) => {
        setRecipeForm((prevForm) => ({
            ...prevForm,
            pictures: prevForm.pictures
                ? prevForm.pictures.filter((_, i) => i !== index)
                : [],
        }))
    }

    return (
        <Grid container spacing={2} p={1} sx={{ maxHeight: '32em', overflowY: 'auto' }}>
            <Grid size={6}>
                <Paper variant="outlined">
                    <Card raised>
                        <CardActionArea
                            sx={{ height: 195, paddingTop: 3 }}
                            component="label"
                            role={undefined}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <AddIcon sx={{ fontSize: '100px' }} />
                            </CardContent>

                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePictureUpload}
                                multiple
                            />
                        </CardActionArea>
                    </Card>
                </Paper>
            </Grid>

            {recipeForm.pictures?.map((picture, i) => {
                const url = URL.createObjectURL(picture.file)
                return (
                    <Grid size={6} key={i}>
                        <Card
                            raised
                            data-active={i === 0 ? '' : undefined}
                            sx={{
                                '&[data-active]': {
                                    outline: `solid 0.3rem ${theme.palette.primary.main}`,
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                        >
                            {i === 0 ? (
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={url}
                                    onLoad={() => URL.revokeObjectURL(url)}
                                    title="Zdjęcie przepisu"
                                />
                            ) : (
                                <CardActionArea onClick={() => setPictureToDefault(i)}>
                                    <Tooltip title="Uczyń głównym">
                                        <CardMedia
                                            sx={{ height: 140 }}
                                            image={url}
                                            onLoad={() => URL.revokeObjectURL(url)}
                                        />
                                    </Tooltip>
                                </CardActionArea>
                            )}

                            <CardActions>
                                <IconButton
                                    aria-label="remove"
                                    onClick={() => {
                                        setSelectedPicture({ i, name: picture.file.name })
                                        setModalOpen(true)
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                {i === 0 && (
                                    <Stack direction="row" paddingLeft={10} spacing={1}>
                                        <Typography
                                            variant="overline"
                                            color={theme.palette.primary.main}
                                        >
                                            {'Główne'}
                                        </Typography>
                                        <StarIcon
                                            htmlColor={theme.palette.primary.main}
                                        />
                                    </Stack>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                )
            })}
            <DeleteModal
                open={modalOpen}
                onAction={() => {
                    deletePicture(selectedPicture.i)
                    setModalOpen(false)
                }}
                onClose={() => setModalOpen(false)}
                itemName={selectedPicture.name}
            />
        </Grid>
    )
}
