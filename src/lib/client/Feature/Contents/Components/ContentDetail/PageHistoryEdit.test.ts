import PageHistoryEdit from '$lib/client/Feature/Contents/Components/ContentDetail/PageHistoryEdit.svelte';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { bookInfoStore } from '$lib/client/Feature/Contents/store';
import { get } from 'svelte/store';

describe('PageHistoryEdit', () => {
	it('レンダリング', () => {
		const bookInfo = bookInfoInterfaceMock;
		const store = bookInfoStore(bookInfo);
		const storedValue = get(store);

		render(PageHistoryEdit, { store, storedValue });

		expect(screen.getByText('読んだ記録')).toBeInTheDocument();
	});
});
