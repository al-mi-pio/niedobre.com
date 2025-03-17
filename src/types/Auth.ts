import { UUID } from 'crypto'

export type SignInDTO = {
    login: string
    password: string
}

export type Session = {
    sessionId: UUID
    login: string
}
