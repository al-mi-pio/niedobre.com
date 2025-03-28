import { UUID } from 'crypto'
import { PasswordReset } from '@/types/Auth'

export type User = {
    id: UUID
    login: string
    password: string
    email?: string
    sessionId?: UUID | null
    passwordReset: PasswordReset | null
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
