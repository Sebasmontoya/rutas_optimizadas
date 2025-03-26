module.exports = {
    env: {
        node: true,
        commonjs: true,
    },
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        //'plugin:@typescript-eslint/recommended',
        //'plugin:@typescript-eslint/eslint-recommended',
        //'plugin:prettier/recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        //'@typescript-eslint/no-dynamic-delete': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-explicit-any': 'warn', //TODO: Debe ser error
        'no-console': 'error',
        'no-multi-spaces': 2,
        'no-trailing-spaces': 2,
        'one-var': ['error', 'never'],
        'no-unreachable': 'error',
        'no-return-await': 'error',
        'no-eq-null': 'error',
        'no-else-return': 'error',
        'no-self-compare': 'error',
        'max-params': ['error', 6],
        'default-param-last': ['error'],
        'no-delete-var': 'error',
        'linebreak-style': ['error', 'unix'],
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^(_|injectable|)',
                ignoreRestSiblings: false,
                vars: 'all',
                args: 'none',
            },
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        'comma-spacing': [
            'error',
            {
                before: false,
                after: true,
            },
        ],
        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: true,
            },
        ],
    },
};
