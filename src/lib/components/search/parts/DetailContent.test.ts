import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { requestBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import DetailContent from '$lib/components/search/parts/DetailContent.svelte';
import type { books_v1 } from 'googleapis';

describe('DetailContent', async () => {
	const isbn = '978-4-15-120051-9';
	const result: books_v1.Schema$Volumes = await requestBookInfosByQueries('', '', isbn, 10, 0);
	const item: books_v1.Schema$Volume = result.items![0];

	it('レンダリング', async () => {
		render(DetailContent, { item });

		await waitFor(
			() => {
				expect(screen.getByAltText('書影')).toBeInTheDocument();
			},
			{ timeout: 5000 }
		);
		expect(screen.getByText(item.volumeInfo?.title!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.authors?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText('データ無し')).toBeInTheDocument(); //データが無い場合はテキストを変更する
		expect(screen.getByText(item.volumeInfo?.publishedDate!)).toBeInTheDocument();
		expect(screen.getByText(`${item.volumeInfo?.pageCount!}ページ`)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.description!)).toBeInTheDocument();
	});
});
