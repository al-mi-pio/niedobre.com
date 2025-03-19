import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    {
        ignores: ['.next', 'package.json', 'package-lock.json', 'node_modules'],
    },
    {
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: ['@mui/*/*/*'],
                },
            ],
        },
    },
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:prettier/recommended'
    ),
]

export default eslintConfig
