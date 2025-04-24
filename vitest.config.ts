import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    alias: {
      $lib: resolve(__dirname, './src/lib'),
      $mocks: resolve(__dirname, './src/mocks'),
      '$app/navigation': resolve(__dirname, './src/mocks/app/navigation.ts'),
      '$app/stores': resolve(__dirname, './src/mocks/app/stores.ts'),
      '$app/environment': resolve(__dirname, './src/mocks/app/environment.ts')
    }
  }
}); 