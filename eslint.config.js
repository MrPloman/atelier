// eslint.config.js (raíz)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['packages/*/src/**/*.ts'],
    rules: {
      // overrides
    },
  },
  {
    files: ['packages/*/tests/**/*.ts', 'packages/*/playground/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
);