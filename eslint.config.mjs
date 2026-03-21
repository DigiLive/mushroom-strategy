import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint configuration file.
 * Following Flat Config standards for ESLint v10.
 * Applying names to blocks for better transparency in the inspector.
 */
export default [
  {
    name: 'global-ignores',
    ignores: ['dist/', 'node_modules/', 'src/types/homeassistant/', 'src/types/lovelace-mushroom/'],
  },
  {
    name: 'eslint-recommended',
    ...js.configs.recommended,
  },
  ...tsPlugin.configs['flat/recommended'].map((config, index) => ({
    ...config,
    name: `typescript-recommended-${index}`,
  })),
  {
    name: 'main-project-rules',
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.es2020,
        ...globals.node,
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
      'no-console': 'off',
      'no-empty-function': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    name: 'config-overrides',
    // Add the eslint config file here to prevent the "parserOptions.project" error
    files: ['webpack.config.ts', 'webpack.dev.config.ts', 'eslint.config.mjs'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
  {
    name: 'prettier-final-override',
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
];
