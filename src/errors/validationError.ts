import { ValidationErrorPayload } from '@/types/defualt'

export class ValidationError extends Error {
    payload: ValidationErrorPayload[]
    constructor(message: string, payload: ValidationErrorPayload[]) {
        super(message)
        this.name = 'ValidationError'
        this.payload = payload
    }
}
