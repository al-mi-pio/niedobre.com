'use server'
import fs from 'fs'

export const getFromFile = async (filePath: string) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export const setToFile = async (filePath: string, file: object) => {
    fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf8')
}
