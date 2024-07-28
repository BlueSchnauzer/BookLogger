import { BookInfoEntityResource } from '$lib/client/Infrastructure/MongoDB/BookInfoEntityResource';
import { BookInfoAPIMock } from '$lib/mock/Fixture/index';
import BookInfoMongoDBModel from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';
import { getEntityTestData } from '$lib/mock/Data';
import { json } from '@sveltejs/kit';
import type { books_v1 } from 'googleapis';
import { beforeAll, describe, expect, it, vi } from 'vitest';

describe('get', () => {
	const dbModels = BookInfoAPIMock.setGetRouteFetch('get');
	it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', async () => {
		const repos = new BookInfoEntityResource();
		const response = await repos.get();

		expect(response.length).toEqual(1);
		expect(response[0].title).toEqual(dbModels[0].title);
	});

	it('エラーになった時に対応した戻り値を返すこと？', () => {});
});

describe('getByStatus', () => {
	BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

	it('statusにwishを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
		const repos = new BookInfoEntityResource();
		const response = await repos.getByStatus('wish');

		expect(response.length).toEqual(1);
		expect(response[0].status.value).toEqual('wish');
	});

	it('statusにreadingを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
		const repos = new BookInfoEntityResource();
		const response = await repos.getByStatus('reading');

		expect(response.length).toEqual(1);
		expect(response[0].status.value).toEqual('reading');
	});

	it('statusにcompleteを指定してリクエストした際に、対応したレスポンスを戻り値で返すこと', async () => {
		const repos = new BookInfoEntityResource();
		const response = await repos.getByStatus('complete');

		expect(response.length).toEqual(1);
		expect(response[0].status.value).toEqual('complete');
	});
});

describe('getRecent', () => {
	BookInfoAPIMock.setGetRouteFetch('getByStatusOrRecent');

	it('SvelteAPIへのリクエストが成功した際に、レスポンスをEntityに変換して戻り値で返すこと', async () => {
		const repos = new BookInfoEntityResource();
		const response = await repos.getRecent();

		expect(response).not.toBeUndefined();
		expect(response!.pageHistories?.length).toEqual(2);
	});
});

describe('getPageHistory', () => {
	it('SvelteAPIへのリクエストが成功した際に、レスポンスをValueObjectに変換して戻り値で返すこと', async () => {
		const data = new BookInfoMongoDBModel(getEntityTestData());
		const mockFetch = vi.spyOn(global, 'fetch');

		const pageHistory = [data.pageHistories];
		mockFetch.mockImplementation(async () => json(pageHistory, { status: 200 }));

		const repos = new BookInfoEntityResource();
		const response = await repos.getPageHistory();

		expect(response[0].length).toEqual(2);
		expect(response[0][0].value.pageCount).toEqual(data.pageHistories![0].pageCount);
		expect(response[0][1].value.pageCount).toEqual(data.pageHistories![1].pageCount);
	});
});

describe('insert', () => {
	it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', async () => {
		BookInfoAPIMock.setPostRouteFetch('success');

		const repos = new BookInfoEntityResource();
		const response = await repos.insert({} as books_v1.Schema$Volume);

		expect(response.ok).toBeTruthy();
	});

	it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', async () => {
		BookInfoAPIMock.setPostRouteFetch('failed');

		const repos = new BookInfoEntityResource();
		const response = await repos.insert({} as books_v1.Schema$Volume);

		expect(response.ok).toBeFalsy();
	});
});

describe('update', () => {
	it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', async () => {
		BookInfoAPIMock.setPutRouteFetch('success');

		const repos = new BookInfoEntityResource();
		const response = await repos.update(getEntityTestData(), true);

		expect(response.ok).toBeTruthy();
	});

	it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', async () => {
		BookInfoAPIMock.setPutRouteFetch('failed');

		const repos = new BookInfoEntityResource();
		const response = await repos.update(getEntityTestData(), true);

		expect(response.ok).toBeFalsy();
	});
});

describe('delete', () => {
	it('SvelteAPIへのリクエストが成功した際に、成功のレスポンスを返すこと', async () => {
		BookInfoAPIMock.setDeleteRouteFetch('success');

		const repos = new BookInfoEntityResource();
		const response = await repos.delete('test');

		expect(response.ok).toBeTruthy();
	});

	it('SvelteAPIへのリクエストが失敗した際に、失敗のレスポンスを返すこと', async () => {
		BookInfoAPIMock.setDeleteRouteFetch('failed');

		const repos = new BookInfoEntityResource();
		const response = await repos.delete('test');

		expect(response.ok).toBeFalsy();
	});
});
