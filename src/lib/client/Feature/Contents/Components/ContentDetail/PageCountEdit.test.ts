import PageCountEdit from '$lib/client/Feature/Contents/Components/ContentDetail/PageCountEdit.svelte';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { bookInfoStore } from '$lib/client/Feature/Contents/store';
import { get } from 'svelte/store';

describe('PageCountEdit', () => {
	const bookInfo = bookInfoInterfaceMock;
	const store = bookInfoStore(bookInfo);
	const storedValue = get(store);

	it('レンダリング', () => {
		const bookInfo = bookInfoInterfaceMock;
		render(PageCountEdit, { storedValue });

		expect(screen.getByText(`${bookInfo.pageCount}ページ`)).toBeInTheDocument();
	});

	it('編集ボタンを押すことでページ数を編集できること', async () => {
		const bookInfo = bookInfoInterfaceMock;
		render(PageCountEdit, { storedValue });

		const editButton = screen.getByRole('button', { name: 'btnEditPageCount' });
		await fireEvent.click(editButton);

		const editField = screen.getByTestId('editPageCount');
		expect(editField).toBeInTheDocument();

		await userEvent.clear(editField);
		await userEvent.type(editField, '500');

		expect(bookInfo.pageCount).toEqual(500);
	});
});
