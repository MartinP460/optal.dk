import js from '@eslint/js'
import ts from 'typescript-eslint'
// @ts-ignore
import onlyWarn from 'eslint-plugin-only-warn'
import eslintConfigPrettier from 'eslint-config-prettier'
import turboPlugin from 'eslint-plugin-turbo'
import importPlugin from 'eslint-plugin-import'
import svelte from 'eslint-plugin-svelte'
import vitest from '@vitest/eslint-plugin'
import globals from 'globals'

export const config = ts.config(
  js.configs.recommended,
  eslintConfigPrettier,
  ...ts.configs.recommended,

  /* Svelte config. */
  ...svelte.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    }
  },

  /* Turbo config. */
  {
    plugins: {
      turbo: turboPlugin
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn'
    },
    ignores: [
      '**/*.DS_Store',
      '**/node_modules',
      '**/build',
      '**/package',
      '**.env',
      '**.env.*',
      '!.env.example',
      '**/ui/',
      '**/coverage,',
      '**/.temp/',
      '**/.vercel/',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock'
    ]
  },

  /* Import order config. */
  {
    files: ['**/*.{ts,tsx,svelte}'],
    extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
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
  },

  /* Only warn config. */
  {
    plugins: {
      onlyWarn
    }
  },

  /* Vitest config. */
  {
    files: ['**/*.test.ts'], // or any other pattern
    plugins: {
      vitest
    },
    rules: {
      ...vitest.configs.recommended.rules // you can also use vitest.configs.all.rules to enable all rules
    }
  }
)
