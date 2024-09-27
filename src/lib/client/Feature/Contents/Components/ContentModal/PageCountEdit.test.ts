import { bookInfoResponseItemMock } from '$lib/mock/Data';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import PageCountEdit from '$lib/client/Feature/Contents/Components/ContentModal/PageCountEdit.svelte';
import userEvent from '@testing-library/user-event';

describe('PageCountEdit', () => {
	it('レンダリング', () => {
		const bookInfoResponseItem = bookInfoResponseItemMock();
		render(PageCountEdit, { item: bookInfoResponseItem });

		expect(screen.getByText(`${bookInfoResponseItem.entity.pageCount}ページ`)).toBeInTheDocument();
	});

	it('編集ボタンを押すことでページ数を編集できること', async () => {
		const bookInfoResponseItem = bookInfoResponseItemMock();
		render(PageCountEdit, { item: bookInfoResponseItem });

		const editButton = screen.getByRole('button', { name: 'btnEditPageCount' });
		await fireEvent.click(editButton);

		const editField = screen.getByTestId('editPageCount');
		expect(editField).toBeInTheDocument();

		await userEvent.clear(editField);
		await userEvent.type(editField, '500');

		expect(bookInfoResponseItem.entity.pageCount).toEqual(500);
	});
});
