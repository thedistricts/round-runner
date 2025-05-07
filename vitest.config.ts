import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    setupFiles: ['./src/setupTests.ts'],
    environment: 'jsdom',
    globals: true,
    alias: {
      $lib: resolve(__dirname, './src/lib')
    }
  }
}); 