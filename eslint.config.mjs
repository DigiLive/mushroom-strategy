import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
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

export default defineConfig([
  globalIgnores([
    '**/dist/',
    '**/node_modules/',
    '**/*.js',
    'src/types/homeassistant/',
    'src/types/lovelace-mushroom/',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.eslint.json'],
      },
    },

    rules: {
      '@typescript-eslint/no-empty-function': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      'comma-dangle': ['error', 'always-multiline'],

      'max-len': [
        'warn',
        {
          code: 120,
        },
      ],

      'no-console': 'off',
      'no-empty-function': 'off',
      'no-unused-vars': 'off',

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      semi: ['error', 'always'],
    },
  },
  {
    files: ['**/webpack.config.ts', '**/webpack.dev.config.ts'],

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: null,
      },
    },
  },
]);
