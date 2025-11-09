module.exports = {
    env: {
        browser: true,
        es6: true,
        jquery: true,
        amd: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            classes: true
        }
    },
    rules: {
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        semi: ['error', 'always'],
        'linebreak-style': 0,
        'no-console': 'off',
        'no-unused-vars': 'off'
    }
};
