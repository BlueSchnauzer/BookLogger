import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { describe, it, expect } from 'vitest';
import { requestByFuzzyQuery, requestByQueries } from './GoogleBooksAPI';

describe('requestByFuzzyQuery', () => {
	it('あいまい条件で一致した書誌データを取得できるか', async () => {
		const result = await requestByFuzzyQuery('イシグロカズオ', 10, 0);

		//複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	//rejectを確認
	it('queryが無い場合にRejectされること', () => {
		requestByFuzzyQuery('', 10, 0).catch((e: Error) => {
			expect(e.message).toEqual('検索条件が入力されていません。');
		});
	});

	//あいまい検索なので何を入れても基本的に引っかかる
	// it('リクエスト結果が0件の際にRejectされること', () => {
	//   requestBookInfoByFuzzySearch('', 10, 0)
	//   .catch((e: Error) => {
	//     expect(e.message).toEqual('検索条件に合う書誌情報が見つかりませんでした。');
	//   });
	// })
});

describe('requestByQueries', () => {
	const testData = bookInfoInterfaceMock;

	it('タイトルを条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestByQueries(testData.title, '', '', 10, 0);

		//タイトル指定は複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	it('著者名を条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestByQueries('', testData.author[0], '', 10, 0);

		//著者指定は複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	it('ISBNを条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestByQueries('', '', testData.identifiers?.value.isbn_13!, 10, 0);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.title).toEqual(testData.title);
	});

	it('複数条件で書誌データを取得できるか', async () => {
		const result = await requestByQueries(
			testData.title,
			testData.author[0],
			testData.identifiers?.value.isbn_13!,
			10,
			0
		);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.title).toEqual(testData.title);
	});

	//rejectを確認
	it('queriesが無い場合にRejectされること', () => {
		requestByQueries('', '', '', 10, 0).catch((e: Error) => {
			expect(e.message).toEqual('検索条件が入力されていません。');
		});
	});

	it('リクエスト結果が0件の際にRejectされること', () => {
		requestByQueries('', '', '0000', 10, 0).catch((e: Error) => {
			expect(e.message).toEqual('検索条件に合う書誌情報が見つかりませんでした。');
		});
	});
});
