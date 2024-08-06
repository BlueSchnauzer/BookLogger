import { describe, expect, it } from 'vitest';
import { bookInfoUseCase } from '$lib/client/Application/UseCases/BookInfo';
import { BookInfoAPIMock } from '$lib/mock/Fixture/index';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { bookInfoInterfaceMock } from '$lib/mock/Data';

describe('getAllBooks', () => {
	BookInfoAPIMock.setGetRouteFetch('get');

	it('get', async () => {
		const usecase = bookInfoUseCase(fetch);
		const bookInfos = await usecase.get();

		expect(bookInfos).toBeDefined();
		expect(bookInfos.length).toBe(1);
	});
});

describe('getByStatusOrRecent', () => {
	BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

	it('getWish', async () => {
		const usecase = bookInfoUseCase(fetch);
		const bookInfos = await usecase.getWish();

		expect(bookInfos).toBeDefined();
		expect(bookInfos.length).toBe(1);
		expect(bookInfos[0].status.value).toBe<status>('wish');
	});

	it('getReading', async () => {
		const usecase = bookInfoUseCase(fetch);
		const bookInfos = await usecase.getReading();

		expect(bookInfos).toBeDefined();
		expect(bookInfos.length).toBe(1);
		expect(bookInfos[0].status.value).toBe<status>('reading');
	});

	it('getComplete', async () => {
		const usecase = bookInfoUseCase(fetch);
		const bookInfos = await usecase.getComplete();

		expect(bookInfos).toBeDefined();
		expect(bookInfos.length).toBe(1);
		expect(bookInfos[0].status.value).toBe<status>('complete');
	});

	it('getRecent', async () => {
		const usecase = bookInfoUseCase(fetch);
		const bookInfo = await usecase.getRecent();

		expect(bookInfo).toBeDefined();
		expect(bookInfo!.pageHistories?.length).toEqual(2);
	});
});

describe('getHistory', () => {
	BookInfoAPIMock.setGetRouteFetch('getPageHistory');

	it('get', async () => {
		const usecase = bookInfoUseCase(fetch);
		const pageHistoryMap = await usecase.getHistory();

		expect(pageHistoryMap).toBeDefined();
	});
});

describe('ChangeBookInfo', () => {
	describe('create', () => {
		it('success', async () => {
			BookInfoAPIMock.setPostRouteFetch('success');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.create({});

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('登録しました');
		});
		it('failed', async () => {
			BookInfoAPIMock.setPostRouteFetch('failed');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.create({});

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('登録に失敗しました。<br>時間をおいて再度登録してください。');
		});
		it('duplicated', async () => {
			BookInfoAPIMock.setPostRouteFetch('duplicted');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.create({});

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('登録済みの書籍です');
		});
	});

	describe('update', () => {
		it('success', async () => {
			BookInfoAPIMock.setPutRouteFetch('success');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.update(bookInfoInterfaceMock, 'wish');

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('更新しました。');
		});
		it('failed', async () => {
			BookInfoAPIMock.setPutRouteFetch('failed');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.update(bookInfoInterfaceMock, 'wish');

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('更新に失敗しました。<br>時間をおいてから再度お試しください。');
		});
	});

	describe('remove', () => {
		it('success', async () => {
			BookInfoAPIMock.setDeleteRouteFetch('success');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.remove(new Id('test'));

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('削除しました');
		});
		it('failed', async () => {
			BookInfoAPIMock.setDeleteRouteFetch('failed');
			const usecase = bookInfoUseCase(fetch);
			const response = await usecase.remove(new Id('test'));

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('削除に失敗しました。<br>時間をおいて再度登録してください。');
		});
	});
});
