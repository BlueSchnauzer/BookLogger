import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { getBookInfosByQueries } from '$lib/GoogleBooksAPI/RequestManage';
import DetailContent from '$lib/components/search/parts/DetailContent.svelte';
import type { books_v1 } from 'googleapis';

describe('DetailContent', async () => {
	const isbn = '978-4-15-120051-9';
	const result: books_v1.Schema$Volumes = await getBookInfosByQueries('', '', isbn);
	const item: books_v1.Schema$Volume = result.items![0];

	it('レンダリング', () => {
		render(DetailContent, {item});

		expect(screen.getByAltText('書影')).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.title!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.authors?.join(',')!)).toBeInTheDocument();
		expect(screen.getByText('データ無し')).toBeInTheDocument(); //データが無い場合はテキストを変更する
		expect(screen.getByText(item.volumeInfo?.publishedDate!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.pageCount!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.description!)).toBeInTheDocument();
	});
});
