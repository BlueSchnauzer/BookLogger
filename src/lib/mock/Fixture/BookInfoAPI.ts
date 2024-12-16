import { APIRouteURLs, BooksURLs } from '$lib/client/Shared/Constants/urls';
import { bookInfoInterfaceMock, bookInfoInterfaceMocks } from '$lib/mock/Data';
import {
	type BookInfoDBModel,
	convertBookInfoToDBModel
} from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';
import { json } from '@sveltejs/kit';
import { beforeAll, vi } from 'vitest';

type getType = 'get' | 'getByStatus' | 'getByRecent' | 'getPageHistory';

/**getルートのレスポンスをbeforeAllで定義する */
export const setGetRouteFetch = (getType: getType) => {
	const mockFetch = vi.spyOn(global, 'fetch');

	switch (getType) {
		case 'get':
			const getData = [convertBookInfoToDBModel(bookInfoInterfaceMock)];
			beforeAll(() => {
				mockFetch.mockImplementation(async () =>
					json({ totalCount: getData.length, bookInfoDBModels: getData }, { status: 200 })
				);
			});
			return getData;
		case 'getByStatus':
			const statusData = bookInfoInterfaceMocks.map((item) => convertBookInfoToDBModel(item));
			beforeAll(() => {
				mockFetch.mockImplementation(async (input) => {
					const dataMap: { [key: string]: BookInfoDBModel | BookInfoDBModel[] } = {
						[`${APIRouteURLs.bookInfo.wish}?page_count=0&query=&order=`]: [statusData[0]],
						[`${APIRouteURLs.bookInfo.reading}?page_count=0&query=&order=`]: [statusData[1]],
						[`${APIRouteURLs.bookInfo.complete}?page_count=0&query=&order=`]: [statusData[2]]
					};
					return dataMap[input as string]
						? json({ totalCount: 1, bookInfoDBModels: dataMap[input as string] }, { status: 200 })
						: new Response('データが見つかりません', { status: 400 });
				});
			});
			return statusData;
		case 'getByRecent':
			const recentData = convertBookInfoToDBModel(bookInfoInterfaceMock);
			beforeAll(() => {
				mockFetch.mockImplementation(async () => json(recentData, { status: 200 }));
			});
			return recentData;
		case 'getPageHistory':
			const pageHistoryData = convertBookInfoToDBModel(bookInfoInterfaceMock);
			beforeAll(() => {
				mockFetch.mockImplementation(async () =>
					json([pageHistoryData.pageHistories], { status: 200 })
				);
			});
			return [pageHistoryData];
		default:
			throw Error(`getTypeが不適切です : getType = ${getType}`);
	}
};

/**Postルートのレスポンスを定義する(成功失敗の両方を返すためbeforeAllなどは使わずfetchのmockのみ定義) */
export const setPostRouteFetch = (status: 'success' | 'failed' | 'duplicted') => {
	const mockFetch = vi.spyOn(global, 'fetch');
	switch (status) {
		case 'success':
			mockFetch.mockImplementation(
				async () => new Response('書誌データの作成に成功しました。', { status: 201 })
			);
			break;
		case 'failed':
			mockFetch.mockImplementation(
				async () => new Response('書誌データの作成に失敗しました。', { status: 500 })
			);
			break;
		case 'duplicted':
			mockFetch.mockImplementation(async () => new Response('登録済みの書籍です', { status: 409 }));
			break;
	}
};

/**Putルートのレスポンスを定義する(成功失敗の両方を返すためbeforeAllなどは使わずfetchのmockのみ定義) */
export const setPutRouteFetch = (status: 'success' | 'failed') => {
	const mockFetch = vi.spyOn(global, 'fetch');
	status === 'success'
		? mockFetch.mockImplementation(
				async () => new Response('書誌データの更新に成功しました。', { status: 200 })
			)
		: mockFetch.mockImplementation(
				async () => new Response('書誌データの更新に失敗しました。', { status: 500 })
			);
};

/**Deleteルートのレスポンスを定義する(成功失敗の両方を返すためbeforeAllなどは使わずfetchのmockのみ定義) */
export const setDeleteRouteFetch = (status: 'success' | 'failed') => {
	const mockFetch = vi.spyOn(global, 'fetch');
	status === 'success'
		? mockFetch.mockImplementation(
				async () => new Response('書誌データの削除に成功しました。', { status: 200 })
			)
		: mockFetch.mockImplementation(
				async () => new Response('書誌データの削除に失敗しました。', { status: 500 })
			);
};
