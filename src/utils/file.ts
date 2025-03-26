'use server'
import { getCompressedRecipes, patchRecipe } from '@/services/recipeService'
import { Session } from '@/types/Auth'
import { randomUUID, UUID } from 'crypto'
import fs from 'fs'
import { join } from 'path'

export const getFromFile = async (filePath: string) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export const setToFile = async (filePath: string, file: object) => {
    fs.writeFileSync(filePath, JSON.stringify(file, null, 2), 'utf8')
}

export const saveImage = async (
    image: File,
    imageName: string,
    recipeId: UUID,
    session: Session
) => {
    const imageId = randomUUID()
    const folderPath = join(process.cwd(), 'public', 'pictures', imageId)
    fs.mkdirSync(folderPath, { recursive: true })
    const filePath = join(folderPath, imageName)

    const recipes = await getCompressedRecipes(session)
    const recipePictures = recipes.filter((recipe) => recipe.id === recipeId)[0].pictures
    await patchRecipe(
        {
            id: recipeId,
            pictures: [...(recipePictures ?? []), `${imageId}/${imageName}`],
        },
        session
    )

    image.arrayBuffer().then((buffer) => fs.writeFileSync(filePath, Buffer.from(buffer)))
}

export const removeImage = async (
    imagePath: string,
    recipeId: UUID,
    session: Session
) => {
    const folderPath = join(process.cwd(), 'public', 'pictures', imagePath.split('/')[0])
    const recipes = await getCompressedRecipes(session)
    const recipePictures = recipes.filter((recipe) => recipe.id === recipeId)[0].pictures
    const cleansedRecipePictures = recipePictures?.filter(
        (picture) => picture !== imagePath
    )
    await patchRecipe({ id: recipeId, pictures: cleansedRecipePictures }, session)

    try {
        fs.rmdirSync(folderPath, { recursive: true })
    } catch {}
}

export const setDefaultImage = async (
    imagePath: string,
    recipeId: UUID,
    session: Session
) => {
    const recipes = await getCompressedRecipes(session)
    const recipePictures = recipes.filter((recipe) => recipe.id === recipeId)[0].pictures
    const defaultPicture = recipePictures?.filter((picture) => picture === imagePath)[0]
    if (defaultPicture === undefined) {
        throw new Error(`Picture with path ${imagePath} not found`)
    }
    const otherPictures = recipePictures?.filter((picture) => picture !== imagePath)
    await patchRecipe(
        {
            id: recipeId,
            pictures: [defaultPicture, ...(otherPictures ?? [])],
        },
        session
    )
}
