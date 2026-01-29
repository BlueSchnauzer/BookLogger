import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['src/**/*.test.{js,ts}'],
		setupFiles: './src/lib/mock/VitestSetup.ts',
		globals: true,
		environment: 'jsdom'
	}
});
