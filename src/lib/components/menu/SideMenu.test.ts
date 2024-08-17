import { mainMenuItems } from '$lib/client/UI/Shared/DisplayData';
import SideMenu from '$lib/components/menu/SideMenu.svelte';
import { render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { describe, expect, it, vi } from 'vitest';

describe.skip('SideMenu', () => {
	// vi.mock('$app/stores', () => {
	// 	return {
	// 		page: readable({ url: { pathname: 'test' } })
	// 	};
	// });

	it('レンダリング', () => {
		render(SideMenu);

		mainMenuItems.forEach((item) => expect(screen.getByText(item.name)).toBeInTheDocument());
	});
});
