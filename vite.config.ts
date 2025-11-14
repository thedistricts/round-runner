import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'esnext'
	},
	optimizeDeps: {
		include: ['comlink']
	},
	worker: {
		format: 'es'
	},
	test: {
		include: ['src/**/*.{test,spec,svelte.test}.{js,ts}'],
		setupFiles: ['./setupTests.ts'],
		environment: 'jsdom', 
	},
	resolve: process.env.VITEST
		? {
				conditions: ['browser']
			}
		: undefined
});
