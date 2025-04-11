import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { Box, Chip, FormHelperText } from '@mui/material'
import Select, { BaseSelectProps } from '@mui/material/Select'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

export interface ChipDropdownProps extends BaseSelectProps {
    id: string
    elements: { [key: string]: string }
    isChecked: (element: string) => boolean
    label: string
    helperText?: string
    noChips?: boolean
    leftMargin?: string
}

export const ChipDropdown = ({
    id,
    elements,
    isChecked,
    label,
    helperText,
    noChips = false,
    leftMargin,
    ...rest
}: ChipDropdownProps) => {
    return (
        <FormControl sx={leftMargin ? { marginLeft: leftMargin } : {}}>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                labelId={`${id}-label`}
                id={id}
                label={label}
                aria-describedby={`${id}-helper-text`}
                multiple
                renderValue={(selected) =>
                    noChips ? (
                        (selected as []).join(', ')
                    ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as []).map((value) => (
                                <Chip key={value} label={elements[value]} />
                            ))}
                        </Box>
                    )
                }
                MenuProps={MenuProps}
                {...rest}
            >
                {Object.entries(elements).map((element) => (
                    <MenuItem key={element[0]} value={element[0]}>
                        <Checkbox checked={isChecked(element[0])} />
                        <ListItemText primary={element[1]} />
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText>
        </FormControl>
    )
}
