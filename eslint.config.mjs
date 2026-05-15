import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/**
 * ESLint configuration file.
 * Following Flat Config standards for ESLint v10.
 * Applying names to blocks for better transparency in the inspector.
 */
export default defineConfig(
  globalIgnores(['dist/', 'node_modules/', 'src/types/homeassistant/', 'src/types/lovelace-mushroom/']),

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

  {
    name: 'main-project-rules',
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
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
    extends: [tseslint.configs.disableTypeChecked],
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
