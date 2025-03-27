export const filePathValidation = (string: string) => {
    const regex = /^[^<>:"/\\|?*\x00-\x1F]+$/
    return regex.test(string) && string.length > 0
}

export const positiveFloatValidation = (number: string) => {
    const parsedNumber = parseFloat(number)
    return parsedNumber !== null && parsedNumber > 0
}
