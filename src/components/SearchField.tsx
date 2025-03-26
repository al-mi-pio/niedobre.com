import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'
import { ChangeEvent, ComponentProps } from 'react'

interface Props extends ComponentProps<typeof TextField> {
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SearchField = (props: Props) => (
    <TextField
        label="Szukaj"
        type="search"
        size="small"
        slotProps={{
            input: {
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                ),
            },
        }}
        {...props}
    />
)
