import { UUID } from 'crypto'
import { ChangeEvent } from 'react'
import { ValidationError } from '@/errors/ValidationError'
import { SelectChangeEvent } from '@mui/material'

export type ValidationErrorPayload = {
    [key in string]?: string | { [id in UUID]: { [key in string]: string } }
}

export type ValidationData = { name: string; value: string | undefined }

export interface FormTabProps {
    onInputChange: (e: ChangeEvent<unknown> | SelectChangeEvent<unknown>) => void
    errors: ValidationError | null
}
