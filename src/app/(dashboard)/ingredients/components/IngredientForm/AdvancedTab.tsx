import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { InputAdornment, Stack, Typography, TextField } from '@mui/material'
import { IngredientFormTabProps } from '@/types/Ingredient'

export const AdvancedTab = ({
    errors,
    onInputChange,
    ingredientForm,
}: IngredientFormTabProps) => (
    <Stack
        spacing={1}
        sx={{
            maxHeight: '48vh',
            overflowY: 'auto',
        }}
    >
        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <TextField
                required
                value={ingredientForm.nutrientAmount ?? ''}
                name="nutrientAmount"
                onChange={onInputChange}
                error={!!errors?.payload.nutrientAmount}
                helperText={errors?.payload.nutrientAmount as string}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                {ingredientForm.unit}
                            </InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                        },
                    },
                }}
            />

            <Typography variant="body1" color="textPrimary">
                {'zawiera:'}
            </Typography>
        </Stack>

        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <FiberManualRecordIcon sx={{ fontSize: '10px' }} />

            <Typography variant="body1" color="textPrimary">
                {'Wartość kaloryczna'}
            </Typography>

            <TextField
                required
                value={ingredientForm.kcal ?? ''}
                name="kcal"
                onChange={onInputChange}
                error={!!errors?.payload.kcal}
                helperText={errors?.payload.kcal as string}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'kcal'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                        },
                    },
                }}
            />
        </Stack>

        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <FiberManualRecordIcon sx={{ fontSize: '10px' }} />

            <Typography variant="body1" color="textPrimary">
                {'Tłuszcz'}
            </Typography>

            <TextField
                required
                value={ingredientForm.fat ?? ''}
                name="fat"
                onChange={onInputChange}
                error={!!errors?.payload.fat}
                helperText={errors?.payload.fat as string}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'g'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                        },
                    },
                }}
            />
        </Stack>

        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <FiberManualRecordIcon sx={{ fontSize: '10px' }} />

            <Typography variant="body1" color="textPrimary">
                {'Węglowodany'}
            </Typography>

            <TextField
                required
                value={ingredientForm.carbohydrates ?? ''}
                name="carbohydrates"
                onChange={onInputChange}
                error={!!errors?.payload.carbohydrates}
                helperText={errors?.payload.carbohydrates as string}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'g'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                        },
                    },
                }}
            />
        </Stack>

        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <FiberManualRecordIcon sx={{ fontSize: '10px' }} />

            <Typography variant="body1" color="textPrimary">
                {'Białko'}
            </Typography>

            <TextField
                required
                value={ingredientForm.protein ?? ''}
                name="protein"
                onChange={onInputChange}
                error={!!errors?.payload.protein}
                helperText={errors?.payload.protein as string}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'g'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                        },
                    },
                }}
            />
        </Stack>

        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <FiberManualRecordIcon sx={{ fontSize: '10px' }} />

            <Typography variant="body1" color="textPrimary">
                {'Sól'}
            </Typography>

            <TextField
                required
                value={ingredientForm.salt ?? ''}
                name="salt"
                onChange={onInputChange}
                error={!!errors?.payload.salt}
                helperText={errors?.payload.salt as string}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'g'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                        },
                    },
                }}
            />
        </Stack>
    </Stack>
)
