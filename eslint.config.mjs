import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint configuration file.
 * Following Flat Config standards for ESLint v10.
 * Applying names to blocks for better transparency in the inspector.
 */
export default tseslint.config(
  {
    name: 'global-ignores',
    ignores: ['dist/', 'node_modules/', 'src/types/homeassistant/', 'src/types/lovelace-mushroom/'],
  },
  {
    name: 'eslint-recommended',
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended,
  {
    name: 'main-project-rules',
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
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
  }
);
