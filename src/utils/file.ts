'use server'
import { dataError } from '@/errors/DataError'
import { randomUUID } from 'crypto'
import fs from 'fs'
import { join } from 'path'

export const getFromFile = async (filePath: string) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export const setToFile = async (filePath: string, file: object) => {
    fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf8')
}

export const saveImage = async (image: File) => {
    if (!image.name) {
        return dataError(`Błędna nazwa zdjęcia`)
    }
    const imageId = randomUUID()
    const folderPath = join(process.cwd(), 'public', 'pictures', imageId)
    fs.mkdirSync(folderPath, { recursive: true })
    const filePath = join(folderPath, image.name)

    image.arrayBuffer().then((buffer) => fs.writeFileSync(filePath, Buffer.from(buffer)))
    return imageId
}

export const removeImage = async (imagePath: string) => {
    const folderPath = join(process.cwd(), 'public', 'pictures', imagePath.split('/')[0])
    try {
        fs.rmSync(folderPath, { recursive: true })
    } catch {}
}
