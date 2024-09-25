import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'node:path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@/shared': path.resolve(__dirname, '..', 'shared'),
            '@': path.resolve(__dirname, './src'),
        },
    },
});
