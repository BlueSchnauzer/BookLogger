import {
	createBookInfoUseCase,
	getBookInfoUseCase,
	getCompleteBookInfoUseCase,
	getHomeBookInfoUseCases,
	getReadingBookInfoUseCase,
	getWishBookInfoUseCase,
	registeredBookInfoUseCases
} from '$lib/client/Application/UseCases/BookInfo';
import { Id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { BookInfoAPIMock } from '$lib/mock/Fixture/index';
import { describe, expect, it } from 'vitest';

describe('getAllBooks', () => {
	BookInfoAPIMock.setGetRouteFetch('get');

	it('get', async () => {
		const usecase = getBookInfoUseCase(fetch);
		const result = await usecase.get();

		expect(result.items).toBeDefined();
		expect(result.items!.length).toBe(1);
		expect(result.items![0].entity).toBeDefined();
		expect(result.items![0].view).toBeDefined();
	});
});

describe('getByStatus', () => {
	BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

	it('getWish', async () => {
		const usecase = getWishBookInfoUseCase(fetch);
		const result = await usecase.get();

		expect(result.items).toBeDefined();
		expect(result.items!.length).toBe(1);
		expect(result.items![0].entity).toBeDefined();
		expect(result.items![0].view).toBeDefined();
		expect(result.items![0].entity.status.value).toBe<status>('wish');
	});

	it('getReading', async () => {
		const usecase = getReadingBookInfoUseCase(fetch);
		const result = await usecase.get();

		expect(result.items).toBeDefined();
		expect(result.items!.length).toBe(1);
		expect(result.items![0].entity).toBeDefined();
		expect(result.items![0].view).toBeDefined();
		expect(result.items![0].entity.status.value).toBe<status>('reading');
	});

	it('getComplete', async () => {
		const usecase = getCompleteBookInfoUseCase(fetch);
		const result = await usecase.get();

		expect(result.items).toBeDefined();
		expect(result.items!.length).toBe(1);
		expect(result.items![0].entity).toBeDefined();
		expect(result.items![0].view).toBeDefined();
		expect(result.items![0].entity.status.value).toBe<status>('complete');
	});
});

describe('getHomeData', () => {
	describe('getRecent', () => {
		BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

		it('get', async () => {
			const usecase = getHomeBookInfoUseCases(fetch);
			const result = await usecase.getRecent();

			expect(result?.entity).toBeDefined();
			expect(result?.view).toBeDefined();
		});
	});

	describe('get', () => {
		BookInfoAPIMock.setGetRouteFetch('getPageHistory');

		it('getHistory', async () => {
			const usecase = getHomeBookInfoUseCases(fetch);
			const historyMap = await usecase.getHistory();

			expect(historyMap).toBeDefined();
		});
	});
});

describe('create bookinfo', () => {
	it('success', async () => {
		BookInfoAPIMock.setPostRouteFetch('success');

		const usecase = createBookInfoUseCase(fetch);
		const response = await usecase.create({});

		expect(response.isSuccess).toBeTruthy();
		expect(response.message).toBe('登録しました');
	});
	it('failed', async () => {
		BookInfoAPIMock.setPostRouteFetch('failed');

		const usecase = createBookInfoUseCase(fetch);
		const response = await usecase.create({});

		expect(response.isSuccess).toBeFalsy();
		expect(response.message).toBe('登録に失敗しました。<br>時間をおいて再度登録してください。');
	});
	it('duplicated', async () => {
		BookInfoAPIMock.setPostRouteFetch('duplicted');

		const usecase = createBookInfoUseCase(fetch);
		const response = await usecase.create({});

		expect(response.isSuccess).toBeFalsy();
		expect(response.message).toBe('登録済みの書籍です');
	});
});

describe('registered bookinfo', () => {
	describe('update', () => {
		it('success', async () => {
			BookInfoAPIMock.setPutRouteFetch('success');

			const usecase = registeredBookInfoUseCases(fetch);
			const response = await usecase.update(bookInfoInterfaceMock, 'wish');

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('更新しました。');
		});
		it('failed', async () => {
			BookInfoAPIMock.setPutRouteFetch('failed');

			const usecase = registeredBookInfoUseCases(fetch);
			const response = await usecase.update(bookInfoInterfaceMock, 'wish');

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('更新に失敗しました。<br>時間をおいてから再度お試しください。');
		});
	});

	describe('remove', () => {
		it('success', async () => {
			BookInfoAPIMock.setDeleteRouteFetch('success');

			const usecase = registeredBookInfoUseCases(fetch);
			const response = await usecase.remove(new Id('test'));

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('削除しました');
		});
		it('failed', async () => {
			BookInfoAPIMock.setDeleteRouteFetch('failed');

			const usecase = registeredBookInfoUseCases(fetch);
			const response = await usecase.remove(new Id('test'));

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('削除に失敗しました。<br>時間をおいて再度登録してください。');
		});
	});
});
