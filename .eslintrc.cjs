module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
  ],
  ignorePatterns: [
    'dist', 
    '.eslintrc.cjs', 
    'backend/**/*', 
    'migrations/**/*',
    'cypress.config.js',
    'tailwind.config.js',
    'vite.config.ts',
    'jest.config.js',
    'src/vite-env.d.ts'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'off',
    'no-redeclare': 'warn',
  },
}

