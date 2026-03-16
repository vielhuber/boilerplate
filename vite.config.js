import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '_public',
        rollupOptions: {
            input: './_js/script.ts',
            output: {
                entryFileNames: 'bundle.js',
                format: 'iife'
            }
        },
        sourcemap: true,
        minify: false,
        emptyOutDir: false
    }
});
