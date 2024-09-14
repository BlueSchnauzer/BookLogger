import { BookInfoAPIMock } from '$lib/mock/Fixture';
import { describe, it, expect } from 'vitest';
import { getRecentBookInfo, getHistory } from '$lib/client/Feature/Home/DataManage/fetcher';

describe('getRecent', () => {
	BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

	it('get', async () => {
		const result = await getRecentBookInfo(fetch);

		expect(result).toBeDefined();
	});
});

describe('getHistory', () => {
	BookInfoAPIMock.setGetRouteFetch('getPageHistory');

	it('get', async () => {
		const historyMap = await getHistory(fetch);

		expect(historyMap).toBeDefined();
	});
});
