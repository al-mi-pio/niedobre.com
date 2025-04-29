import { UUID } from 'crypto'
import get from '@/utils/config'
import { RateLimiterMemory } from 'rate-limiter-flexible'

export const authRateLimiter = new RateLimiterMemory({
    points: parseInt(get.authRateLimiterPoints()),
    duration: parseInt(get.authRateLimiterDuration()),
})
export const rateLimiter = new RateLimiterMemory({
    points: parseInt(get.rateLimiterPoints()),
    duration: parseInt(get.rateLimiterDuration()),
})
export const appName = 'nieDOBRE.com'
export const autoHideDuration = 6000
export const emptyUUID: UUID = '0-0-0-0-0-0'
export const unknownErrorMessage = 'Wystąpił nieznany problem'
