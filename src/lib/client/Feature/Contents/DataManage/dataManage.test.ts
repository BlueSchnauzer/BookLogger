import { BookInfoAPIMock } from '$lib/mock/Fixture';
import { describe, it, expect } from 'vitest';
import {
	getBookInfos,
	getHistory,
	getRecentBookInfo
} from '$lib/client/Feature/Contents/DataManage/fetcher';
import { updateBookInfo } from '$lib/client/Feature/Contents/DataManage/updater';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { deleteBookInfo } from '$lib/client/Feature/Contents/DataManage/deleter';
import { Id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';

describe('fetcher', () => {
	describe('getBookInfos', () => {
		BookInfoAPIMock.setGetRouteFetch('get');
		it('get', async () => {
			const result = await getBookInfos(fetch, 0);

			expect(result).toBeDefined();
			expect(result.totalCount).toBe(1);
			expect(result.bookInfos.length).toBe(1);
			expect(result.bookInfos[0]).toBeDefined();
		});

		describe('get by status', () => {
			BookInfoAPIMock.setGetRouteFetch('getByStatus');

			it('getWish', async () => {
				const result = await getBookInfos(fetch, 0, { status: 'wish' });

				expect(result).toBeDefined();
				expect(result.totalCount).toBe(1);
				expect(result.bookInfos.length).toBe(1);
				expect(result.bookInfos[0]).toBeDefined();
				expect(result.bookInfos[0].status.value).toBe('wish');
			});

			it('getReading', async () => {
				const result = await getBookInfos(fetch, 0, { status: 'reading' });

				expect(result).toBeDefined();
				expect(result.totalCount).toBe(1);
				expect(result.bookInfos.length).toBe(1);
				expect(result.bookInfos[0]).toBeDefined();
				expect(result.bookInfos[0].status.value).toBe('reading');
			});

			it('getComplete', async () => {
				const result = await getBookInfos(fetch, 0, { status: 'complete' });

				expect(result).toBeDefined();
				expect(result.totalCount).toBe(1);
				expect(result.bookInfos.length).toBe(1);
				expect(result.bookInfos[0]).toBeDefined();
				expect(result.bookInfos[0].status.value).toBe('complete');
			});
		});
	});

	describe('getRecent', () => {
		BookInfoAPIMock.setGetRouteFetch('getByRecent');

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
});

describe('updater', () => {
	it('success', async () => {
		BookInfoAPIMock.setPutRouteFetch('success');

		const response = await updateBookInfo(fetch, bookInfoInterfaceMock, 'wish');

		expect(response.isSuccess).toBeTruthy();
		expect(response.message).toBe('更新しました。');
	});
	it('failed', async () => {
		BookInfoAPIMock.setPutRouteFetch('failed');

		const response = await updateBookInfo(fetch, bookInfoInterfaceMock, 'wish');

		expect(response.isSuccess).toBeFalsy();
		expect(response.message).toBe('更新に失敗しました。<br>時間をおいてから再度お試しください。');
	});
});

describe('deleter', () => {
	it('success', async () => {
		BookInfoAPIMock.setDeleteRouteFetch('success');

		const response = await deleteBookInfo(fetch, new Id('test'));

		expect(response.isSuccess).toBeTruthy();
		expect(response.message).toBe('削除しました');
	});
	it('failed', async () => {
		BookInfoAPIMock.setDeleteRouteFetch('failed');

		const response = await deleteBookInfo(fetch, new Id('test'));

		expect(response.isSuccess).toBeFalsy();
		expect(response.message).toBe('削除に失敗しました。<br>時間をおいて再度登録してください。');
	});
});
