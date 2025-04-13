import { InputAdornment, MenuItem, Stack, Typography, TextField } from '@mui/material'
import { foodGroups, units } from '@/constants/ingredients'
import { IngredientFormTabProps } from '@/types/Ingredient'
import { selectOutOfScope } from '@/app/(dashboard)/ingredients/utils'

export const MainTab = ({
    errors,
    oppositeUnits = ['g', 'dg', 'kg'],
    onInputChange,
    ingredientForm,
    hoveredErroredField,
    setHoveredErroredField = () => {},
}: IngredientFormTabProps) => (
    <>
        <TextField
            required
            label="Nazwa"
            value={ingredientForm.name ?? ''}
            name="name"
            onChange={onInputChange}
            error={!!errors?.payload.name}
            helperText={errors?.payload.name as string}
            onMouseEnter={() => setHoveredErroredField('name')}
            onMouseLeave={() => setHoveredErroredField(undefined)}
            slotProps={{
                formHelperText: {
                    sx: {
                        whiteSpace: 'nowrap',
                        overflow: hoveredErroredField === 'name' ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                    },
                },
            }}
        />

        <TextField
            select
            label="Kategoria"
            value={ingredientForm.foodGroup ?? ''}
            name="foodGroup"
            sx={{ width: '16ch' }}
            onChange={onInputChange}
            error={!!errors?.payload.foodGroup}
            helperText={errors?.payload.foodGroup as string}
            onMouseEnter={() => setHoveredErroredField('foodGroup')}
            onMouseLeave={() => setHoveredErroredField(undefined)}
            slotProps={{
                formHelperText: {
                    sx: {
                        whiteSpace: 'nowrap',
                        overflow:
                            hoveredErroredField === 'foodGroup' ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                    },
                },
            }}
        >
            {foodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                    {group}
                </MenuItem>
            ))}
        </TextField>

        <TextField
            select
            required
            label="Jednostka bazowa"
            value={ingredientForm.unit ?? ''}
            name="unit"
            sx={{ width: '22ch' }}
            onChange={onInputChange}
            error={!!errors?.payload.unit}
            helperText={errors?.payload.unit as string}
            onMouseEnter={() => setHoveredErroredField('unit')}
            onMouseLeave={() => setHoveredErroredField(undefined)}
            slotProps={{
                formHelperText: {
                    sx: {
                        whiteSpace: 'nowrap',
                        overflow: hoveredErroredField === 'unit' ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                    },
                },
            }}
        >
            {units.map((unit) => (
                <MenuItem key={unit} value={unit}>
                    {unit}
                </MenuItem>
            ))}
        </TextField>

        {ingredientForm.unit && ingredientForm.unit !== 'szt.' && (
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    alignItems: 'center',
                }}
            >
                <TextField
                    required
                    value={ingredientForm.amount ?? ''}
                    name="amount"
                    onChange={onInputChange}
                    error={!!errors?.payload.amount}
                    helperText={errors?.payload.amount as string}
                    onMouseEnter={() => setHoveredErroredField('amount')}
                    onMouseLeave={() => setHoveredErroredField(undefined)}
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
                                overflow:
                                    hoveredErroredField === 'amount'
                                        ? 'visible'
                                        : 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        },
                    }}
                />

                <Typography variant="body1" color="textPrimary">
                    {'jest równoważne'}
                </Typography>

                <Stack direction="row" spacing={1}>
                    <TextField
                        required
                        value={ingredientForm.oppositeAmount ?? ''}
                        name="oppositeAmount"
                        onChange={onInputChange}
                        error={!!errors?.payload.oppositeAmount}
                        helperText={errors?.payload.oppositeAmount as string}
                        onMouseEnter={() => setHoveredErroredField('oppositeAmount')}
                        onMouseLeave={() => setHoveredErroredField(undefined)}
                        sx={{ width: '8ch' }}
                        slotProps={{
                            formHelperText: {
                                sx: {
                                    width: '8ch',
                                    whiteSpace: 'nowrap',
                                    overflow:
                                        hoveredErroredField === 'oppositeAmount'
                                            ? 'visible'
                                            : 'hidden',
                                    textOverflow: 'ellipsis',
                                },
                            },
                        }}
                    />

                    <TextField
                        select
                        required
                        value={
                            ingredientForm.oppositeUnit &&
                            !selectOutOfScope(ingredientForm)
                                ? ingredientForm.oppositeUnit
                                : ''
                        }
                        name="oppositeUnit"
                        error={!!errors?.payload.oppositeUnit}
                        helperText={errors?.payload.oppositeUnit as string}
                        onMouseEnter={() => setHoveredErroredField('oppositeUnit')}
                        onMouseLeave={() => setHoveredErroredField(undefined)}
                        sx={{ width: 'fit-content', maxWidth: '11ch' }}
                        onChange={onInputChange}
                        slotProps={{
                            formHelperText: {
                                sx: {
                                    whiteSpace: 'nowrap',
                                    overflow:
                                        hoveredErroredField === 'oppositeUnit'
                                            ? 'visible'
                                            : 'hidden',
                                    textOverflow: 'ellipsis',
                                    visibility:
                                        hoveredErroredField !== 'oppositeAmount' ||
                                        !errors?.payload.oppositeAmount
                                            ? 'visible'
                                            : 'hidden',
                                },
                            },
                        }}
                    >
                        <MenuItem value={undefined}>---</MenuItem>
                        {oppositeUnits.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                                {unit}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>
            </Stack>
        )}

        <Stack
            direction="row"
            spacing={2}
            sx={{
                alignItems: 'center',
            }}
        >
            <TextField
                required
                value={ingredientForm.costAmount ?? ''}
                name="costAmount"
                onChange={onInputChange}
                error={!!errors?.payload.costAmount}
                helperText={errors?.payload.costAmount as string}
                onMouseEnter={() => setHoveredErroredField('costAmount')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
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
                            overflow:
                                hoveredErroredField === 'costAmount'
                                    ? 'visible'
                                    : 'hidden',
                            textOverflow: 'ellipsis',
                        },
                    },
                }}
            />

            <Typography variant="body1" color="textPrimary">
                {'kosztuje'}
            </Typography>

            <TextField
                required
                value={ingredientForm.cost ?? ''}
                name="cost"
                onChange={onInputChange}
                error={!!errors?.payload.cost}
                helperText={errors?.payload.cost as string}
                onMouseEnter={() => setHoveredErroredField('cost')}
                onMouseLeave={() => setHoveredErroredField(undefined)}
                sx={{ width: '12ch' }}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">{'zł'}</InputAdornment>
                        ),
                    },
                    formHelperText: {
                        sx: {
                            whiteSpace: 'nowrap',
                            overflow:
                                hoveredErroredField === 'cost' ? 'visible' : 'hidden',
                            textOverflow: 'ellipsis',
                            visibility:
                                hoveredErroredField !== 'costAmount' ||
                                ingredientForm.costAmount
                                    ? 'visible'
                                    : 'hidden',
                        },
                    },
                }}
            />
        </Stack>
    </>
)
