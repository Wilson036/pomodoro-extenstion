import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.json';
import path from 'path';

export default defineConfig({
    plugins: [react(), crx({ manifest: manifest })],
    resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'), // 加這行
        },
    },
    build: { outDir: 'dist' },
});
