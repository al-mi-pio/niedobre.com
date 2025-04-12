import { UUID } from 'crypto'

export type ValidationErrorPayload = {
    [key in string]?: string | { [id in UUID]: { [key in string]: string } }
}

export type ValidationData = { name: string; value: string | undefined }
