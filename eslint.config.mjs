import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/* Import boundaries. A later `no-restricted-imports` replaces an earlier one, so each block lists everything it needs. */
const noTestFakes = {
  group: ['**/platform/testing', '**/platform/testing/**', './testing/**'],
  message: 'Test fakes are for tests only.',
}
const noElectronInCore = {
  group: ['electron', 'electron/*'],
  message: 'core/ must not import Electron. Use a platform adapter interface.',
}
const noOsAdaptersInCore = {
  group: ['**/platform/win32', '**/platform/win32/**', '**/platform/darwin', '**/platform/darwin/**'],
  message: 'core/ talks only to platform/types.ts interfaces.',
}
const noCrossAdapterImports = {
  group: ['**/win32', '**/win32/**', '**/darwin', '**/darwin/**', '**/other', '**/other/**'],
  message: 'OS adapters must not import each other. Share code through platform/common/.',
}
const restrictImports = (...patterns) => ({ 'no-restricted-imports': ['error', { patterns }] })

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
    // Test fakes never ship.
    files: ['src/main/**/*.ts'],
    ignores: ['src/main/**/*.test.ts', 'src/main/platform/testing/**'],
    rules: restrictImports(noTestFakes),
  },
  {
    // Each OS adapter stands alone.
    files: ['src/main/platform/{win32,darwin,other}/**/*.ts'],
    rules: restrictImports(noTestFakes, noCrossAdapterImports),
  },
  {
    // core/ is platform-agnostic: no Electron, no native modules, no OS checks.
    files: ['src/main/core/**/*.ts'],
    ignores: ['src/main/core/**/*.test.ts'],
    rules: {
      ...restrictImports(noTestFakes, noElectronInCore, noOsAdaptersInCore),
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
    // core/ tests may use the fakes, but still never Electron or a real adapter.
    files: ['src/main/core/**/*.test.ts'],
    rules: restrictImports(noElectronInCore, noOsAdaptersInCore),
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
)
