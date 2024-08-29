import { bookInfoOperations } from '$lib/client/Application/Operations/BookInfo';
import { bookInfoResponseItemMock } from '$lib/mock/Data';
import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PageHistoryEdit from '$lib/client/UI/Contents/ContentModal/PageHistoryEdit.svelte';

describe('PageHistoryEdit', () => {
	it('レンダリング', () => {
		const bookInfoResponseItem = bookInfoResponseItemMock();
		const operations = bookInfoOperations(bookInfoResponseItem.entity);

		render(PageHistoryEdit, { item: bookInfoResponseItem, operations });

		expect(screen.getByText('読んだ記録')).toBeInTheDocument();
	});
});
