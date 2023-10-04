import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test}.{js,ts}'],
		setupFiles: './src/lib/vitest-setup.ts',
		globals: true,
		environment: 'jsdom'
	}
});
