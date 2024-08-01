import { json } from '@sveltejs/kit';
import { beforeAll, vi } from 'vitest';
import { getEntityTestData, getEntityTestDatas } from '$lib/mock/Data';
import BookInfoMongoDBModel from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';

type getType = 'get' | 'getByStatusOrRecent' | 'getPageHistory';

/**getルートのレスポンスをbeforeAllで定義する */
export const setGetRouteFetch = (getType: getType) => {
	const mockFetch = vi.spyOn(global, 'fetch');

	switch (getType) {
		case 'get':
			const getData = [new BookInfoMongoDBModel(getEntityTestData())];
			beforeAll(() => {
				mockFetch.mockImplementation(async () => json(getData, { status: 200 }));
			});
			return getData;
		case 'getByStatusOrRecent':
			const requestUrl = '/api/bookinfo';
			const statusOrRecentData = getEntityTestDatas().map((item) => new BookInfoMongoDBModel(item));
			beforeAll(() => {
				mockFetch.mockImplementation(async (input) => {
					const dataMap: { [key: string]: BookInfoMongoDBModel | BookInfoMongoDBModel[] } = {
						[`${requestUrl}?type=wish`]: [statusOrRecentData[0]],
						[`${requestUrl}?type=reading`]: [statusOrRecentData[1]],
						[`${requestUrl}?type=complete`]: [statusOrRecentData[2]],
						[`${requestUrl}?type=recent`]: statusOrRecentData[0]
					};
					return dataMap[input as string]
						? json(dataMap[input as string], { status: 200 })
						: new Response('データが見つかりません', { status: 400 });
				});
			});
			return statusOrRecentData;
		case 'getPageHistory':
			const pageHistoryData = new BookInfoMongoDBModel(getEntityTestData());
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
