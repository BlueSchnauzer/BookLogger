import type { IBookInfoEntityRepository } from '$lib/client/Domain/Repositories/IBookInfoEntity';
import { BookInfoEntityResource } from '$lib/client/Infrastructure/MongoDB/BookInfoEntityResource';
import { describe, expect, it } from 'vitest';
import { BookInfoUseCase } from '$lib/client/Application/UseCases/BookInfo';
import { BookInfoAPIMock } from '$lib/mock/Fixture/index';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';

const repos: IBookInfoEntityRepository = new BookInfoEntityResource();
const usecase = new BookInfoUseCase(repos);

describe('getAllBooks', () => {
	BookInfoAPIMock.setGetRouteFetch('get');

	it('get', async () => {
		const views = await usecase.get();

		expect(views).toBeDefined();
		expect(views.length).toBe(1);
	});
});

describe('getByStatusOrRecent', () => {
	BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

	it('getWish', async () => {
		const views = await usecase.getWish();

		expect(views).toBeDefined();
		expect(views.length).toBe(1);
		expect(views[0].status.value).toBe<status>('wish');
	});

	it('getReading', async () => {
		const views = await usecase.getReading();

		expect(views).toBeDefined();
		expect(views.length).toBe(1);
		expect(views[0].status.value).toBe<status>('reading');
	});

	it('getComplete', async () => {
		const views = await usecase.getComplete();

		expect(views).toBeDefined();
		expect(views.length).toBe(1);
		expect(views[0].status.value).toBe<status>('complete');
	});

	it('getRecent', async () => {
		const view = await usecase.getRecent();

		expect(view).toBeDefined();
	});
});

describe('getHistory', () => {
	BookInfoAPIMock.setGetRouteFetch('getPageHistory');

	it('get', async () => {
		const pageHistoryMap = await usecase.getHistory();

		expect(pageHistoryMap).toBeDefined();
	});
});

describe('ChangeBookInfo', () => {
	describe('create', () => {
		it('success', async () => {
			BookInfoAPIMock.setPostRouteFetch('success');
			const response = await usecase.create({});

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('登録しました');
		});
		it('failed', async () => {
			BookInfoAPIMock.setPostRouteFetch('failed');
			const response = await usecase.create({});

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('登録に失敗しました。<br>時間をおいて再度登録してください。');
		});
		it('duplicated', async () => {
			BookInfoAPIMock.setPostRouteFetch('duplicted');
			const response = await usecase.create({});

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('登録済みの書籍です');
		});
	});

	describe('update', () => {
		it('success', async () => {
			BookInfoAPIMock.setPutRouteFetch('success');
			const response = await usecase.update({} as BookInfo, true);

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('更新しました。');
		});
		it('failed', async () => {
			BookInfoAPIMock.setPutRouteFetch('failed');
			const response = await usecase.update({} as BookInfo, true);

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('更新に失敗しました。<br>時間をおいてから再度お試しください。');
		});
	});

	describe('delete', () => {
		it('success', async () => {
			BookInfoAPIMock.setDeleteRouteFetch('success');
			const response = await usecase.delete(new Id('test'));

			expect(response.isSuccess).toBeTruthy();
			expect(response.message).toBe('削除しました');
		});
		it('failed', async () => {
			BookInfoAPIMock.setDeleteRouteFetch('failed');
			const response = await usecase.delete(new Id('test'));

			expect(response.isSuccess).toBeFalsy();
			expect(response.message).toBe('削除に失敗しました。<br>時間をおいて再度登録してください。');
		});
	});
});
