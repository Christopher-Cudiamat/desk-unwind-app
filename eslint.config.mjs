import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['out/**', 'dist/**', 'release/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts', '*.config.{ts,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/renderer/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    // core/ is platform-agnostic: no Electron, no native modules, no OS checks.
    files: ['src/main/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['electron', 'electron/*'],
              message: 'core/ must not import Electron. Use a platform adapter interface.',
            },
            {
              group: ['**/platform/win32/**', '**/platform/darwin/**'],
              message: 'core/ talks only to platform/types.ts interfaces.',
            },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'platform',
          message: 'core/ must not branch on OS. Use adapter capabilities.',
        },
      ],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
)
