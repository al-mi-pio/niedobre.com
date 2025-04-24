export const dataError = (message: string) => {
    return {
        errorType: 'DataError',
        message,
    } as DataError
}

export interface DataError {
    errorType: 'DataError'
    message: string
}
