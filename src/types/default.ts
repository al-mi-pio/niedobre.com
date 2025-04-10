export type ValidationErrorPayload = {
    [Field in string]?: string
}

export type ValidationData = { name: string; value: string | undefined }
