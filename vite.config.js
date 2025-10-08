import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '_public',
        rollupOptions: {
            input: './_js/script.js',
            output: {
                entryFileNames: 'bundle.js',
                format: 'iife',
                inlineDynamicImports: true
            }
        },
        sourcemap: true,
        minify: false,
        emptyOutDir: false
    }
});
