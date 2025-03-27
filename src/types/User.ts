import { UUID } from 'crypto'

export type User = {
    id: UUID
    login: string
    password: string
    email?: string
    sessionId?: UUID | null
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
    baseIngredientOptOut: boolean
    email?: string
}
