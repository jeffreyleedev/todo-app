import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    plugins: {
      boundaries,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      'boundaries/elements': [
        {
          type: 'domain',
          pattern: 'src/domain/**/*',
        },
        {
          type: 'application',
          pattern: 'src/application/**/*',
        },
        {
          type: 'infrastructure',
          pattern: 'src/infrastructure/**/*',
        },
        {
          type: 'presentation',
          pattern: 'src/presentation/**/*',
        },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        2,
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'domain' },
              allow: [{ to: { type: 'domain' } }],
            },
            {
              from: { type: 'application' },
              allow: [
                { to: { type: 'domain' } },
                { to: { type: 'application' } },
              ],
            },
            {
              from: { type: 'infrastructure' },
              allow: [
                { to: { type: 'domain' } },
                { to: { type: 'infrastructure' } },
              ],
            },
            {
              from: { type: 'presentation' },
              allow: [
                { to: { type: 'domain' } },
                { to: { type: 'application' } },
                { to: { type: 'presentation' } },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['e2e/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
