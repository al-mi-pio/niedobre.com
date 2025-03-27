const get = {
    hashIterations: () => parseInt(process.env.HASH_ITERATIONS ?? '12334'),
    keyLength: () => parseInt(process.env.KEY_LENGTH ?? '32'),
    hasAlgorithm: () => process.env.HASH_ALGORITHM ?? 'sha256',
}

export default get
