export const filePathValidation = (string: string) => {
    const regex = /^[^<>:"/\\|?*\x00-\x1F]+$/
    return regex.test(string) && string.length
}

export const loginValidation = (login: string) => {
    const regex = /^[a-zA-Z0-9]+$/
    return regex.test(login) && login.length
}

export const positiveFloatValidation = (number: string) => {
    const parsedNumber = parseFloat(number)
    return parsedNumber !== null && parsedNumber > 0
}

export const emailValidation = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email) && email.length
}

export const passwordValidation = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return regex.test(password)
}
