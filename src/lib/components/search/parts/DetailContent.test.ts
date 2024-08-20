import DetailContent from '$lib/components/search/parts/DetailContent.svelte';
import { gapiItemAndBookSearchResponseItemMock, gapiTestDatas } from '$lib/mock/Data';
import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('DetailContent', async () => {
	const { item, bookSearchResponseItem } = gapiItemAndBookSearchResponseItemMock();

	it('レンダリング', async () => {
		render(DetailContent, { bookSearch: bookSearchResponseItem });

		await waitFor(
			() => {
				expect(screen.getByAltText('書影')).toBeInTheDocument();
			},
			{ timeout: 5000 }
		);
		expect(screen.getByText(item.volumeInfo?.title!)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.authors?.join(',')!)).toBeInTheDocument();
		//expect(screen.getByText('データ無し')).toBeInTheDocument(); //データが無い場合はテキストを変更する
		expect(screen.getByText(item.volumeInfo?.publishedDate!)).toBeInTheDocument();
		expect(screen.getByText(`${item.volumeInfo?.pageCount!}ページ`)).toBeInTheDocument();
		expect(screen.getByText(item.volumeInfo?.description!)).toBeInTheDocument();
	});
});
