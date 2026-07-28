import { readFileSync } from 'node:fs';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

let packageConfiguration = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
let buildFolder = packageConfiguration.config?.build_folder ?? '_public';

export default defineConfig([
    globalIgnores(['_libs/**', `${buildFolder}/**`]),
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jquery,
                ...globals.amd,
                ...globals.es2022
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            quotes: ['error', 'single', { allowTemplateLiterals: true }],
            semi: ['error', 'always'],
            'linebreak-style': 'off',
            'no-console': 'off',
            'no-unused-vars': 'off'
        }
    }
]);
