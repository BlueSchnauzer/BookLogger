import { render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import { readable } from 'svelte/store';
import BottomMenu from '$lib/components/menu/BottomMenu.svelte';

describe('BottomMenu', () => {
	vi.mock('$app/stores', () => {
		return {
			page: readable({ url: { pathname: 'test' } })
		};
	});

	it('レンダリング', () => {
		render(BottomMenu);

		expect(screen.getByText('ホーム')).toBeInTheDocument();
		expect(screen.getByText('ライブラリ')).toBeInTheDocument();
		expect(screen.getByText('書籍検索')).toBeInTheDocument();
		expect(screen.getByText('本棚')).toBeInTheDocument();
	});
});
