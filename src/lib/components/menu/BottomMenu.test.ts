import { mainMenuItems } from '$lib/client/UI/Shared/DisplayData';
import BottomMenu from '$lib/components/menu/BottomMenu.svelte';
import { render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';

describe('BottomMenu', () => {
	vi.mock('$app/stores', () => {
		return {
			page: readable({ url: { pathname: 'test' } })
		};
	});

	it('レンダリング', () => {
		render(BottomMenu);

		mainMenuItems.forEach((item) => expect(screen.getByText(item.name)).toBeInTheDocument());
	});
});
