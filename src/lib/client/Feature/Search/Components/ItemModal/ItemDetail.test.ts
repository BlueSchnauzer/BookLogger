import ItemDetail from '$lib/client/Feature/Search/Components/ItemModal/ItemDetail.svelte';
import { bookSearchInterfaceMock } from '$lib/mock/Data';
import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('ResultDetail', async () => {
	const bookSearch = bookSearchInterfaceMock;

	it('レンダリング', async () => {
		render(ItemDetail, { bookSearch });

		await waitFor(
			() => {
				expect(screen.getByAltText('書影')).toBeInTheDocument();
			},
			{ timeout: 5000 }
		);
		expect(screen.getByText(bookSearch.title!)).toBeInTheDocument();
		expect(screen.getByText(bookSearch.authors?.join(',')!)).toBeInTheDocument();
		//expect(screen.getByText('データ無し')).toBeInTheDocument(); //データが無い場合はテキストを変更する
		expect(screen.getByText(bookSearch.publishedDate!)).toBeInTheDocument();
		expect(screen.getByText(`${bookSearch.pageCount!}ページ`)).toBeInTheDocument();
		expect(screen.getByText(bookSearch.description!)).toBeInTheDocument();
	});
});
