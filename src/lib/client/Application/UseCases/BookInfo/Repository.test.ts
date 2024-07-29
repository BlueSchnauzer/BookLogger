import type { IBookInfoEntityRepository } from '$lib/client/Domain/Repositories/IBookInfoEntity';
import { BookInfoEntityResource } from '$lib/client/Infrastructure/MongoDB/BookInfoEntityResource';
import { describe, expect, it } from 'vitest';
import { BookInfoRepositoryUseCase } from '$lib/client/Application/UseCases/BookInfo/Repository';
import { BookInfoAPIMock } from '$lib/mock/Fixture/index';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';

describe('BookInfoRepositoryUseCase', () => {
	const repos: IBookInfoEntityRepository = new BookInfoEntityResource();
	const usecase = new BookInfoRepositoryUseCase(repos);

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

});
