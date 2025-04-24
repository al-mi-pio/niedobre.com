export const conversionError = (message: string) => {
    return {
        errorType: 'ConversionError',
        message,
    } as ConversionError
}

export interface ConversionError {
    errorType: 'ConversionError'
    message: string
}
