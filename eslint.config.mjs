import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            'eslint.config.mjs',
            'dist',
            'jest.config.js',
            'migrate-mongo-config.js',
            'migrations',
        ],
    },
    ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslintEslintPlugin,
            'simple-import-sort': simpleImportSort,
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'module',

            parserOptions: {
                project: 'tsconfig.json',
            },
        },

        rules: {
            'no-shadow': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-require-imports': ['off'],
            '@typescript-eslint/no-var-requires': ['off'],
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-unused-vars': ['error'],
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            'prettier/prettier': [
                'error',
                {
                    bracketSpacing: true,
                    tabWidth: 4,
                    printWidth: 100,
                    useTabs: false,
                    singleQuote: true,
                    endOfLine: 'auto',
                },
            ],
        },
    },

    {
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
        },
    },
];
