import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tailwindcss from 'eslint-plugin-tailwindcss';
import importPlugin from 'eslint-plugin-import';
import checkFile from 'eslint-plugin-check-file';
import globals from 'globals';

export default [
  // Global ignores (replaces ignorePatterns)
  { ignores: ['dist', 'eslint.config.mjs', 'vite.config.ts', '**/*.d.ts'] },

  // Base configs (replaces extends)
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'check-file': checkFile,
      tailwindcss,
      import: importPlugin,
    },
    settings: {
      tailwindcss: {
        cssConfigPath: './src/styles/globals.css', // your v4 CSS config
      },
    },
    rules: {
      // react-hooks recommended (replaces plugin:react-hooks/recommended)
      ...reactHooks.configs.recommended.rules,
      // Tailwind
      'tailwindcss/enforces-shorthand': 'warn',
      'tailwindcss/classnames-order': 'off',
      // Custom rules
      'import/no-cycle': ['error', { maxDepth: 5 }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
      ],

      // Base rule for .ts files (camel-case and pascal-case)
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.ts': 'CAMEL_CASE',
          '**/*.tsx': 'PASCAL_CASE | CAMEL_CASE',
        },
      ],
    },
  },
  // Overrides (each becomes its own array entry)
  {
    files: ['**/*.styled.tsx'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['PascalCase'],
        },
      ],
    },
  },
];
