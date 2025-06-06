import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier/recommended';
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript';
import vueConfigPrettier from '@vue/eslint-config-prettier';

export default defineConfigWithVueTs(
  {
    ignores: ['dist', 'node_modules', 'eslint.config.js'],
  },
  {
    extends: [
      pluginJs.configs.recommended,
      tseslint.configs.recommended,
      pluginVue.configs['flat/recommended'],
      vueTsConfigs.recommended,
      prettier,
    ],
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        parser: tseslint.parser,
      },
    },
    rules: {
      // JS
      'no-unused-vars': 'off',

      // TS
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^props$' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',

      // Vue
      ...vueConfigPrettier.rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true,
        },
      ],

      // Prettier
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          printWidth: 80,
        },
      ],
    },
  },
);
