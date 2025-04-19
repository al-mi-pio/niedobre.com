'use server'
import { Session, SignInDTO } from '@/types/Auth'
import { join } from 'path'
import { randomUUID, UUID } from 'crypto'
import { User } from '@/types/User'
import { hashString, verifyHash, verifySession } from '@/utils/auth'
import { patchUser } from '@/services/userService'
import { getFromFile, setToFile } from '@/utils/file'
import { createTransport } from 'nodemailer'
import get from '@/utils/config'
import { appName } from '@/constants/general'
import { passwordValidation } from '@/utils/validate'
import { SessionError } from '@/errors/SessionError'

export const signIn = async ({ login, password }: SignInDTO) => {
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    if (!login)
        return {
            type: 'error',
            error: 'Pole login jest wymagane',
        }
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        return {
            type: 'error',
            error: `Użytkownik z loginem ${login} nie istnieje`,
        }
    }

    const result = await verifyHash(password, user.password)

    if (result) {
        const sessionId = randomUUID()
        user.sessionId = sessionId
        await setToFile(filePath, user)
        return sessionId
    }
    return {
        type: 'error',
        error: 'Hasło jest nieprawidłowe',
    }
}

export const signOut = async (session: Session) => {
    const verifiedSession = await verifySession(session)
    if (verifiedSession instanceof SessionError) {
        return verifiedSession
    }

    await patchUser({ sessionId: null }, session)
}

export const resetPasswordRequest = async (login: string, url: string) => {
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    if (!login)
        return {
            type: 'error',
            error: 'Pole login jest wymagane',
        }
    let user: User

    try {
        user = await getFromFile(filePath)
    } catch {
        return {
            type: 'error',
            error: `Użytkownik z loginem ${login} nie istnieje`,
        }
    }

    if (!user.email) {
        return {
            type: 'error',
            error: `Ten użytkownik nie posiada adresu email`,
        }
    }

    const passwordResetToken = randomUUID()
    if (!user.passwordReset || user.passwordReset.timestamp < Date.now()) {
        user.passwordReset = {
            passwordResetToken: passwordResetToken,
            timestamp: Date.now() + 10 * 60 * 1000,
        }
        await setToFile(filePath, user)
    }

    const email = 'niedobre.com@gmail.com'
    const link = `${url}/resetpassword?token=${passwordResetToken}&login=${login}`
    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: email,
            pass: get.mailPassword(),
        },
    })
    const date = new Date(Date.now())
    const mailOptions = {
        from: email,
        to: user.email,
        subject: `${appName} reset hasła`,
        html: `<p>Otrzymaliśmy prośbę o zresetowanie twojego hasła ${date.toLocaleDateString('pl-Pl')} o ${date.toLocaleTimeString('pl-PL')}</p><br/>
                <p>Kliknij <a href="${link}">następujący link</a>, aby zresetować twoje hasło</p><br/>
                <p>Link straci ważność o ${new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString('pl-PL')}. Nikomu nie podawaj tego linku!</p>`,
    }

    await transporter.sendMail(mailOptions)
    return {}
}

export const changePassword = async (
    login: string,
    passwordResetToken: UUID,
    newPassword: string
) => {
    const filePath = join(process.cwd(), 'src', 'data', 'users', login, 'user.json')
    if (!login)
        return {
            type: 'error',
            error: 'Pole login jest wymagane',
        }
    let user: User
    try {
        user = await getFromFile(filePath)
    } catch {
        return {
            type: 'error',
            error: `Użytkownik z loginem ${login} nie istnieje`,
        }
    }

    if (
        user.passwordReset &&
        user.passwordReset.passwordResetToken === passwordResetToken &&
        user.passwordReset.timestamp > Date.now()
    ) {
        if (!passwordValidation(newPassword)) {
            return {
                type: 'error',
                error: 'Hasło musi zawierać: przynajmniej 8 liter, duża literę, małą literę oraz liczbę',
            }
        }
        user.password = await hashString(newPassword)
        await setToFile(filePath, user)
    } else {
        return {
            type: 'error',
            error: 'Link wygasł',
        }
    }
    return {}
}
