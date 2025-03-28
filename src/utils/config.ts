const get = {
    hashIterations: () => parseInt(process.env.HASH_ITERATIONS ?? '12334'),
    keyLength: () => parseInt(process.env.KEY_LENGTH ?? '32'),
    hashAlgorithm: () => process.env.HASH_ALGORITHM ?? 'sha256',
    mailPassword: () => process.env.MAIL_PASSWORD ?? '',
}

export default get
