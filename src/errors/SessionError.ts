export const sessionError = (message: string) => {
    return {
        errorType: 'SessionError',
        message,
    } as SessionError
}

export interface SessionError {
    errorType: 'SessionError'
    message: string
}
