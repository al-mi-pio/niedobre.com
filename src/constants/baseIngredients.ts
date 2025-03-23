import { Ingredient } from '@/types/Ingredient'

export const baseIngredients: Omit<Ingredient, 'id'>[] = [
    {
        name: 'sól',
        type: 'mass',
        conversion: 0.651,
        kcal: 0,
    },
    {
        name: 'mąka pszenna',
        type: 'mass',
        conversion: 0.6,
    },
    {
        name: 'mąka ziemniaczana',
        type: 'mass',
        conversion: 0.76,
    },
    {
        name: 'kasza manna',
        type: 'mass',
        conversion: 0.8,
    },
    {
        name: 'cukier',
        type: 'mass',
        conversion: 0.92,
    },
    {
        name: 'cukier puder',
        type: 'mass',
        conversion: 0.52,
    },
    {
        name: 'kakao',
        type: 'mass',
        conversion: 0.4,
    },
    {
        name: 'mleko w proszku',
        type: 'mass',
        conversion: 0.48,
    },
    {
        name: 'olej',
        type: 'volume',
        conversion: 1.08,
    },
    {
        name: 'śmietana 18%',
        type: 'mass',
        conversion: 1.08,
    },
    {
        name: 'śmietana 30%',
        type: 'mass',
        conversion: 1,
    },
    {
        name: 'mleko',
        type: 'volume',
        conversion: 1,
    },
    {
        name: 'białko',
        type: 'volume',
        conversion: 1,
    },
    {
        name: 'miód',
        type: 'volume',
        conversion: 0.73,
    },
    {
        name: 'bułka tarta',
        type: 'mass',
        conversion: 1.66,
    },
    {
        name: 'masło',
        type: 'mass',
        conversion: 1,
    },
    {
        name: 'proszek do pieczenia',
        type: 'mass',
        conversion: 0.66,
    },
]
