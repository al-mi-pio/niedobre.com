import { UUID } from 'crypto'
import { passwordReset } from './Auth'

export type User = {
    id: UUID
    login: string
    password: string
    email?: string
    sessionId?: UUID | null
    passwordReset: passwordReset | null
}

export type PatchUserDTO = {
    login?: string
    password?: string
    email?: string
    sessionId?: UUID | null
}

export type CreateUserDTO = {
    login: string
    password: string
    keepBaseIngredients: boolean
    email?: string
}
