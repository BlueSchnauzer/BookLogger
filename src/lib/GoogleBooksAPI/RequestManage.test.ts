import { describe, it, expect, beforeEach } from 'vitest';
import {
	requestBookInfo,
	getThumbnailByIsbn,
	requestBookInfosByQueries,
	requestBookInfoWithPartialResource,
	requestBookInfoByFuzzySearch
} from './RequestManage';
import { getTestData } from '$lib/vitest-setup';
import type { BookInfo } from '$lib/server/models/BookInfo';

describe.skip('requestBookInfo', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('ISBNを条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfo([`isbn:${testData.identifier?.isbn_13}`]);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.title).toEqual(testData.title);
	});

	it('タイトルを条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfo([`intitle:${testData.title}`]);

		//タイトル指定は複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	it('著者名を条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfo([`inauthor:${testData.author[0]}`]);

		//著者指定は複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	it('複数条件で書誌データを取得できるか', async () => {
		const result = await requestBookInfo([
			`isbn:${testData.identifier?.isbn_13}`,
			`intitle:${testData.title}`,
			`inauthor:${testData.author[0]}`
		]);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.title).toEqual(testData.title);
	});

	it('検索結果が複数ある時に、取得数を制限できるか', async () => {
		const defaultCounts = await requestBookInfo([`inauthor:${testData.author[0]}`]);
		expect(defaultCounts.items).toBeDefined();
		expect(defaultCounts.items?.length).toEqual(10);

		const twenty = await requestBookInfo([`inauthor:${testData.author[0]}`], 20);
		expect(twenty.items).toBeDefined();
		expect(twenty.items?.length).toEqual(20);
	});

	it('検索結果が複数ある際に、ページングができるか', async () => {
		const pageOne = await requestBookInfo([`inauthor:${testData.author[0]}`], 10, 0);
		expect(pageOne.totalItems).toBeGreaterThanOrEqual(11);
		const firstItem = pageOne.items![0].volumeInfo;

		const pageTwo = await requestBookInfo([`inauthor:${testData.author[0]}`], 10, 10);
		const eleventhItem = pageTwo.items![0].volumeInfo;

		expect(firstItem).not.toEqual(eleventhItem);
	});
});

describe.skip('requestBookInfoWithPartialResource', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('リソースを指定して取得できるか', async () => {
		const result = await requestBookInfoWithPartialResource(
			[`isbn:${testData.identifier?.isbn_13}`],
			'items(volumeInfo/imageLinks/thumbnail)'
		);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.imageLinks?.thumbnail).toBeDefined();
		expect(result.items![0].volumeInfo?.imageLinks?.smallThumbnail).not.toBeDefined();
	});

	it('リソースを指定しない場合、全てのリソースが取得できるか', async () => {
		const result = await requestBookInfoWithPartialResource([
			`isbn:${testData.identifier?.isbn_13}`
		]);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.imageLinks?.thumbnail).toBeDefined();
		expect(result.items![0].volumeInfo?.imageLinks?.smallThumbnail).toBeDefined();
	});
});

describe.skip('requestBookInfoByFuzzySearch', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('あいまい条件で一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfoByFuzzySearch('イシグロカズオ', 10, 0);

		//複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	//rejectを確認
	it('queryが無い場合にRejectされること', () => {
		requestBookInfoByFuzzySearch('', 10, 0).catch((e: Error) => {
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

describe.skip('requestBookInfosByQueries', () => {
	let testData: BookInfo;
	beforeEach(() => {
		testData = getTestData();
	});

	it('タイトルを条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfosByQueries(testData.title, '', '', 10, 0);

		//タイトル指定は複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	it('著者名を条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfosByQueries('', testData.author[0], '', 10, 0);

		//著者指定は複数取れるので、一致させずに1件でもあればOK
		expect(result.items).toBeDefined();
	});

	it('ISBNを条件にして一致した書誌データを取得できるか', async () => {
		const result = await requestBookInfosByQueries('', '', testData.identifier?.isbn_13!, 10, 0);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.title).toEqual(testData.title);
	});

	it('複数条件で書誌データを取得できるか', async () => {
		const result = await requestBookInfosByQueries(
			testData.title,
			testData.author[0],
			testData.identifier?.isbn_13!,
			10,
			0
		);

		expect(result.items).toBeDefined();
		expect(result.items![0].volumeInfo?.title).toEqual(testData.title);
	});

	//rejectを確認
	it('queriesが無い場合にRejectされること', () => {
		requestBookInfosByQueries('', '', '', 10, 0).catch((e: Error) => {
			expect(e.message).toEqual('検索条件が入力されていません。');
		});
	});

	it('リクエスト結果が0件の際にRejectされること', () => {
		requestBookInfosByQueries('', '', '0000', 10, 0).catch((e: Error) => {
			expect(e.message).toEqual('検索条件に合う書誌情報が見つかりませんでした。');
		});
	});
});

describe.skip('getThumbnailByIsbn', () => {
	it('ISBNを条件にして書影を取得できること', async () => {
		const thumbnail = await getThumbnailByIsbn('978-4-15-120051-9');

		expect(thumbnail).toBeTruthy();
	});

	it('ISBNを持っていない場合にRejectされること', async () => {
		await getThumbnailByIsbn('').catch((e: Error) => {
			expect(e.message).toEqual('ISBNが設定されていません。');
		});
	});

	it('リクエスト結果が0件の際にRejectされること', async () => {
		await getThumbnailByIsbn('00000').catch((e: Error) => {
			expect(e.message).toEqual('検索条件に合う書影が見つかりませんでした。');
		});
	});
});
