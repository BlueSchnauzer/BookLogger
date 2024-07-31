import { describe, expect, it } from 'vitest';
import { BookSearchView } from '$lib/client/Application/Views/BookSearch';
import { gapiTestDatas } from '$lib/mock/Data';
import type { books_v1 } from 'googleapis';

describe('BookInfoView', () => {
	const volume = gapiTestDatas.items![0];

	describe('initialize', () => {
		it('properties', () => {
			const view = new BookSearchView(volume);
			const handleExpect = (viewValue: any, entityValue: any) => {
				expect(viewValue).toBe(entityValue);
			};

			handleExpect(view.title, volume.volumeInfo?.title);
			handleExpect(view.authors, volume.volumeInfo?.authors);
			handleExpect(view.publisher, volume.volumeInfo?.publisher);
			handleExpect(view.publishedDate, volume.volumeInfo?.publishedDate);
			handleExpect(view.pageCount, volume.volumeInfo?.pageCount);
			handleExpect(view.thumbnail, volume.volumeInfo?.imageLinks?.thumbnail);
			handleExpect(view.description, volume.volumeInfo?.description);
		});
	});

	describe('titleLabel', () => {
		it('get label', () => {
			const view = new BookSearchView(volume);
			const noPropsView = new BookSearchView({});
			const handleExpect = (view: BookSearchView<books_v1.Schema$Volume>, expectValue: string) => {
				expect(view.titleLabel).toBe(expectValue);
			};

			handleExpect(view, volume.volumeInfo?.title!);
			handleExpect(noPropsView, 'データ無し');
		});
	});

	describe('joinedAuthorNames', () => {
		it('get names', () => {
			const view = new BookSearchView(volume);
			//const manyAuthorsView = new BookSearchView({...volume});
			const handleExpect = (view: BookSearchView<books_v1.Schema$Volume>, expectValue: string) => {
				expect(view.joinedAuthorNames).toBe(expectValue);
			};

			handleExpect(view, volume.volumeInfo?.authors![0]!);
		});
	});

	describe('pageCountLabel', () => {
		it('get label', () => {
			const view = new BookSearchView(volume);
			const noPropsView = new BookSearchView({});
			const handleExpect = (view: BookSearchView<books_v1.Schema$Volume>, expectValue: string) => {
				expect(view.pageCountLabel).toBe(expectValue);
			};

			handleExpect(view, `${volume.volumeInfo?.pageCount}ページ`);
			handleExpect(noPropsView, '0ページ');
		});
	});
});
