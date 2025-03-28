import { Ingredient } from '@/types/Ingredient'

export const baseIngredients: Omit<Ingredient, 'id'>[] = [
    {
        name: 'sól',
        type: 'mass',
        conversion: 0.651,
        kcal: 0,
        foodGroup: 'inne',
    },
    {
        name: 'mąka pszenna',
        type: 'mass',
        conversion: 0.6,
        foodGroup: 'zboże',
    },
    {
        name: 'mąka ziemniaczana',
        type: 'mass',
        conversion: 0.76,
        foodGroup: 'węglowodany',
    },
    {
        name: 'kasza manna',
        type: 'mass',
        conversion: 0.8,
        foodGroup: 'zboże',
    },
    {
        name: 'cukier',
        type: 'mass',
        conversion: 0.92,
        foodGroup: 'węglowodany',
    },
    {
        name: 'cukier puder',
        type: 'mass',
        conversion: 0.52,
        foodGroup: 'węglowodany',
    },
    {
        name: 'kakao',
        type: 'mass',
        conversion: 0.4,
        foodGroup: 'inne',
    },
    {
        name: 'mleko w proszku',
        type: 'mass',
        conversion: 0.48,
        foodGroup: 'nabiał',
    },
    {
        name: 'olej',
        type: 'volume',
        conversion: 1.08,
        foodGroup: 'tłuszcz',
    },
    {
        name: 'śmietana 18%',
        type: 'mass',
        conversion: 1.08,
        foodGroup: 'nabiał',
    },
    {
        name: 'śmietana 30%',
        type: 'mass',
        conversion: 1,
        foodGroup: 'nabiał',
    },
    {
        name: 'mleko',
        type: 'volume',
        conversion: 1,
        foodGroup: 'nabiał',
    },
    {
        name: 'białko',
        type: 'volume',
        conversion: 1,
        foodGroup: 'białko',
    },
    {
        name: 'miód',
        type: 'volume',
        conversion: 0.73,
        foodGroup: 'węglowodany',
    },
    {
        name: 'bułka tarta',
        type: 'mass',
        conversion: 0.6,
        foodGroup: 'zboże',
    },
    {
        name: 'masło',
        type: 'mass',
        conversion: 1,
        foodGroup: 'tłuszcz',
    },
    {
        name: 'proszek do pieczenia',
        type: 'mass',
        conversion: 0.66,
        foodGroup: 'inne',
    },
    {
        name: 'jajka',
        type: 'amount',
        foodGroup: 'białko',
    },
]
