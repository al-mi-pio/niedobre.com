'use client'
import { signIn, singOut } from '@/services/authService'
import { createUser, deleteUser, getUser, patchUser } from '@/services/userService'
import { setSession, getSession, removeSession } from '@/utils/session'

export default function Home() {
    return (
        <>
            <button
                onClick={async () =>
                    await createUser({ login: 'test1', password: 'ttt', email: 'pog' })
                        .then(() => {})
                        .catch((err) => {
                            console.log(err)
                        })
                }
            >
                {'create'}
            </button>
            <br></br>
            <button
                onClick={async () => {
                    try {
                        const a = await signIn({ login: 'test1', password: 'ttt' })
                        setSession({ sessionId: a, login: 'test1' })
                    } catch (E) {
                        console.log(E.message)
                    }
                }}
            >
                {'login'}
            </button>
            <br></br>
            <button
                onClick={async () => {
                    try {
                        const a = await singOut(getSession())
                        console.log(a)
                        removeSession() // mmmmmmmmm
                    } catch (E) {
                        console.log(E.message)
                    }
                }}
            >
                {'logout'}
            </button>
            <br></br>
            <button
                onClick={async () => {
                    try {
                        const a = await getUser(getSession())
                        console.log(a)
                    } catch (E) {
                        console.log(E.message)
                    }
                }}
            >
                {'get'}
            </button>
            <br></br>
            <button
                onClick={async () => {
                    try {
                        const a = await deleteUser(getSession())
                        console.log(a)
                        removeSession()
                    } catch (E) {
                        console.log(E.message)
                    }
                }}
            >
                {'delete'}
            </button>
            <br></br>
            <button
                onClick={async () => {
                    try {
                        const a = await patchUser({ email: 'swapped mail' }, getSession())
                        console.log(a)
                    } catch (E) {
                        console.log(E.message)
                    }
                }}
            >
                {'update'}
            </button>
        </>
    )
}
