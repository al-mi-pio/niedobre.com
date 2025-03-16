import { UUID } from 'crypto'

export type User = {
    id: UUID
    login: string
    password: string
    email?: string
    sessionId?: UUID
}

export type PatchUserDTO = {
    login?: string
    password?: string
    email?: string
}

export type CreateUserDTO = {
    login: string
    password: string
    email?: string
}
