const get = {
    hashIterations: () => parseInt(process.env.HASH_ITERATIONS ?? '123'),
    keyLength: () => parseInt(process.env.KEY_LENGTH ?? '16'),
    hasAlgorithm: () => process.env.HASH_ALGORITHM ?? 'sha256',
}

export default get
