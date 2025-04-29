const get = {
    hashIterations: () => parseInt(process.env.HASH_ITERATIONS ?? '12334'),
    keyLength: () => parseInt(process.env.KEY_LENGTH ?? '32'),
    hashAlgorithm: () => process.env.HASH_ALGORITHM ?? 'sha256',
    mailPassword: () => process.env.MAIL_PASSWORD ?? '',
    authRateLimiterPoints: () => process.env.AUTH_RATE_LIMIT_POINTS ?? '10',
    authRateLimiterDuration: () => process.env.AUTH_RATE_LIMIT_DURATION ?? '60',
    rateLimiterPoints: () => process.env.RATE_LIMIT_POINTS ?? '200',
    rateLimiterDuration: () => process.env.RATE_LIMIT_DURATION ?? '60',
}

export default get
