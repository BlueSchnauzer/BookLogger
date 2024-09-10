import { BookInfoAPIMock } from '$lib/mock/Fixture';
import { describe, it, expect } from 'vitest';
import { createBookInfo } from '$lib/client/Feature/Search/DataManage/creater';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { searchByFuzzyQuery, searchByQueries } from './fetcher';

describe('creater', () => {
	it('success', async () => {
		BookInfoAPIMock.setPostRouteFetch('success');

		const response = await createBookInfo(fetch, {});

		expect(response.isSuccess).toBeTruthy();
		expect(response.message).toBe('登録しました');
	});
	it('failed', async () => {
		BookInfoAPIMock.setPostRouteFetch('failed');

		const response = await createBookInfo(fetch, {});

		expect(response.isSuccess).toBeFalsy();
		expect(response.message).toBe('登録に失敗しました。<br>時間をおいて再度登録してください。');
	});
	it('duplicated', async () => {
		BookInfoAPIMock.setPostRouteFetch('duplicted');

		const response = await createBookInfo(fetch, {});

		expect(response.isSuccess).toBeFalsy();
		expect(response.message).toBe('登録済みの書籍です');
	});
});

describe('fetcher', () => {
	it('searcyByFuzzyQuery', async () => {
		const { totalCount, items } = await searchByFuzzyQuery('イシグロカズオ');

		expect(totalCount).toBeGreaterThanOrEqual(0);
		expect(items).toBeDefined();
		expect(items?.length).toBeTruthy();
	});

	it('searchByQueries', async () => {
		const testData = bookInfoInterfaceMock;

		const { totalCount, items } = await searchByQueries(
			testData.title,
			testData.author[0],
			testData.identifiers?.value.isbn_13!
		);

		expect(totalCount).toBeGreaterThanOrEqual(0);
		expect(items).toBeDefined();
		expect(items?.length).toBeTruthy();
	});
});
