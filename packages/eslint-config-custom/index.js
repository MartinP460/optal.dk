module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
    'turbo',
    'plugin:import/errors',
    'plugin:import/warnings'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true
      }
    ],
    'import/order': [
      'warn',
      {
        groups: ['external', 'builtin', 'type', 'internal', 'sibling', 'parent', 'index']
      }
    ],
    'import/no-unresolved': ['off'],
    'import/no-named-as-default': 0,
    'import/no-named-as-default-member': 0,
    'import/default': 0
  }
}
