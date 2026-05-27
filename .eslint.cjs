module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Mallen ska vara permissiv
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off'
    }
}