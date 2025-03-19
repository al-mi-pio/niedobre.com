'use client'
import { signIn, singOut } from '@/services/authService'
import {
    createIngredient,
    deleteIngredient,
    getIngredients,
    patchIngredient,
} from '@/services/ingredientService'
import { createUser, deleteUser, getUser, patchUser } from '@/services/userService'
import { getSession, removeSession, setSession } from '@/utils/session'

import { randomUUID } from 'crypto'

export const Test = () => (
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
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await createIngredient(
                        { name: 'pieprz', type: 'amount', cost: 1 },
                        getSession()
                    )
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'add ing'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await patchIngredient(
                        { id: '06403ba5-055d-4d76-a02e-e9f695697331', name: 'cukier' },
                        getSession()
                    )
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'update ing'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await deleteIngredient(
                        '06403ba5-055d-4d76-a02e-e9f695697331',
                        getSession()
                    )
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'remove ing'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await getIngredients(getSession())
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'get ingredients'}
        </button>
    </>
)

export default Test
