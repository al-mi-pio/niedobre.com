import { ValidationErrorPayload } from '@/types/default'

export const validationError = (message: string, payload: ValidationErrorPayload) => {
    return {
        errorType: 'ValidationError',
        message,
        payload,
    } as ValidationError
}

export interface ValidationError {
    errorType: 'ValidationError'
    message: string
    payload: ValidationErrorPayload
}
