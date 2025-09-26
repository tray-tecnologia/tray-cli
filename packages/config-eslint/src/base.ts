import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'cli/files-to-lint',
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    name: 'cli/files-to-ignore',
    ignores: ['**/*.config.{js,mjs,cjs,ts}', 'coverage', 'dist'],
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    name: 'cli/typescript',
    rules: {
      eqeqeq: 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
        },
        {
          selector: 'variable',
          format: ['camelCase'],
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'typeProperty',
          format: null,
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          custom: {
            regex: '^[A-Z]$',
            match: true,
          },
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: null,
          custom: {
            regex: `^['"]?[A-Z]+([-_][A-Z]+)*['"]?$`,
            match: true,
          },
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
        {
          selector: 'import',
          format: ['camelCase', 'PascalCase'],
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-useless-concat': 'error',
      'sort-imports': [
        'error',
        {
          allowSeparatedGroups: true,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: true,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportDeclaration[specifiers.length = 0]',
          message: 'Empty imports are not allowed',
        }, // Block empty imports
      ],
    },
  },
  {
    files: ['__tests__/**/*.{js,mjs,cjs,ts}'],
    plugins: {
      vitest,
    },
    name: 'cli/vitest',
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/consistent-test-filename': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      'vitest/valid-title': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  }
);
