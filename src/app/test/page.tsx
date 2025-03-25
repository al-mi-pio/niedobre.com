'use client'
import { signIn, signOut } from '@/services/authService'
import {
    createIngredient,
    deleteIngredient,
    getIngredients,
    patchIngredient,
} from '@/services/ingredientService'
import {
    createRecipe,
    deleteRecipe,
    getRecipes,
    patchRecipe,
} from '@/services/recipeService'
import { createUser, deleteUser, getUser, patchUser } from '@/services/userService'
import { calculateIngredients, calculateKcal } from '@/utils/conversion'
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
                    const a = await signOut(getSession())
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
                        { id: '2f0bad4a-8b15-4441-b0ca-701f2b472cc4', name: 'cukier' },
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
                        '2f0bad4a-8b15-4441-b0ca-701f2b472cc4',
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
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await createRecipe(
                        {
                            name: 'pieprznik',
                            ingredients: [
                                {
                                    id: '022974db-3eba-4eb5-93b3-425d1f91f593',
                                    amount: 10,
                                    unit: 'szkl.',
                                },
                                {
                                    id: '022974db-3eba-4eb5-93b3-425d1f91f593',
                                    amount: 5,
                                    unit: 'kg',
                                },
                            ],
                        },
                        getSession()
                    )
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'add recip'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await patchRecipe(
                        {
                            id: 'ffd7b5e5-ad5e-4278-aa2c-3f3977d9c1d5',
                            publicResources: ['name'],
                        },
                        getSession()
                    )
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'update recipe'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await deleteRecipe(
                        'f8e80112-6ee0-422e-87ee-45e84020b106',
                        getSession()
                    )
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'remove recipe'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = await getRecipes(getSession())
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'get  recipes'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = calculateIngredients([
                        {
                            ingredient: {
                                id: '0-8-8-7-6',
                                name: 'Jajka',
                                type: 'amount',
                                cost: 10,
                                kcal: 20,
                            },
                            amount: 5,
                            unit: 'szt.',
                        },
                        {
                            ingredient: {
                                id: '0-8-8-7-6',
                                name: 'Jajka',
                                type: 'amount',
                                cost: 10,
                                kcal: 20,
                            },
                            amount: 100000,
                            unit: 'szt.',
                        },
                        {
                            ingredient: {
                                id: '0-8-8-7-5',
                                name: 'Cukier',
                                type: 'mass',
                                cost: 19,
                                kcal: 2000,
                            },
                            amount: 10,
                            unit: 'kg',
                        },
                        {
                            ingredient: {
                                id: '0-8-8-7-5',
                                name: 'Cukier',
                                type: 'mass',
                                cost: 19,
                                kcal: 2000,
                            },
                            amount: 100,
                            unit: 'g',
                        },
                        {
                            ingredient: {
                                id: '1-8-8-7-5',
                                name: 'sól',
                                type: 'mass',
                            },
                            amount: 100,
                            unit: 'g',
                        },
                        {
                            ingredient: {
                                id: '2-8-8-7-5',
                                name: 'miód',
                                type: 'volume',
                                cost: 190,
                                kcal: 20,
                            },
                            amount: 100,
                            unit: 'L',
                        },
                        {
                            ingredient: {
                                id: '2-8-8-7-5',
                                name: 'miód',
                                type: 'volume',
                                cost: 190,
                                kcal: 20,
                            },
                            amount: 1666,
                            unit: 'mL',
                        },
                        {
                            ingredient: {
                                id: '9-8-8-7-5',
                                name: 'test',
                                type: 'volume',
                                cost: 190,
                                kcal: 20,
                            },
                            amount: 666,
                            unit: 'mL',
                        },
                        {
                            ingredient: {
                                id: '9-8-8-7-5',
                                name: 'test',
                                type: 'volume',
                                cost: 190,
                                kcal: 20,
                            },
                            amount: 666,
                            unit: 'mL',
                        },
                        {
                            ingredient: {
                                id: '9-58-8-7-5',
                                name: 'test2',
                                type: 'volume',
                                cost: 190,
                                kcal: 20,
                            },
                            amount: 666,
                            unit: 'mL',
                        },
                        {
                            ingredient: {
                                id: '99-58-8-7-5',
                                name: 'test3',
                                type: 'volume',
                                cost: 190,
                                kcal: 20,
                                conversion: 2,
                            },
                            amount: 666,
                            unit: 'g',
                        },
                        {
                            ingredient: {
                                id: '99-588-8-7-5',
                                name: 'test4',
                                type: 'mass',
                                cost: 190,
                                kcal: 20,
                                conversion: 2,
                            },
                            amount: 1,
                            unit: 'łyż.',
                        },
                        {
                            ingredient: {
                                id: '99-588-9-7-5',
                                name: 'test5',
                                type: 'amount',
                                cost: 190,
                                kcal: 20,
                                conversion: 2,
                            },
                            amount: 1,
                            unit: 'szt.',
                        },
                    ])
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'calculate lmao'}
        </button>
        <br></br>
        <button
            onClick={async () => {
                try {
                    const a = calculateKcal([
                        {
                            ingredient: {
                                id: '2-8-8-7-5',
                                name: 'miód',
                                type: 'volume',
                                cost: 190,
                                kcal: 2,
                            },
                            amount: 1,
                            unit: 'szkl.',
                        },
                        {
                            ingredient: {
                                id: '2-8-8-7-5',
                                name: 'miód',
                                type: 'volume',
                                cost: 190,
                                kcal: 2,
                            },
                            amount: 1,
                            unit: 'łyż.',
                        },
                    ])
                    console.log(a)
                } catch (E) {
                    console.log(E.message)
                }
            }}
        >
            {'calculate kcal'}
        </button>
    </>
)

export default Test
