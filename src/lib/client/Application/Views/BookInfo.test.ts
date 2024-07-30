import { BookInfo, type bookInfoProperties } from '$lib/client/Domain/Entities/BookInfo';
import { bookInfoPropertiesMock, getEntityTestData } from '$lib/mock/Data';
import { describe, expect, it } from 'vitest';
import { BookInfoView } from './BookInfo';

describe('BookInfoView', () => {
	const entity = getEntityTestData();

	describe('initialize', () => {
		it('properties', () => {
			const view = new BookInfoView(entity);
			const handleExpect = (viewValue: any, entityValue: any) => {
				expect(viewValue).toBe(entityValue);
			};

			handleExpect(view.id, entity.id);
			handleExpect(view.userId, entity.userId);
			handleExpect(view.title, entity.title);
			handleExpect(view.author, entity.author);
			handleExpect(view.thumbnail, entity.thumbnail);
			handleExpect(view.createDate, entity.createDate);
			handleExpect(view.updateDate, entity.updateDate);
			handleExpect(view.pageCount, entity.pageCount);
			handleExpect(view.isFavorite, entity.isFavorite);
			handleExpect(view.status, entity.status);
			handleExpect(view.memorandum, entity.memorandum);
			handleExpect(view.isVisible, entity.isVisible);
			handleExpect(view.completeDate, entity.completeDate);
			handleExpect(view.pageHistories, entity.pageHistories);
			handleExpect(view.shelfCategories, entity.shelfCategories);
			handleExpect(view.gapiId, entity.gapiId);
		});
	});

	describe('titleLabel', () => {
		it('get', () => {
			const view = new BookInfoView(entity);
			const handleExpect = (view: BookInfoView, expectValue: string) => {
				expect(view.titleLabel).toBe(expectValue);
			};

			handleExpect(view, entity.title);
			view.title = '';
			handleExpect(view, 'データ無し');
			view.title = undefined as unknown as string;
			handleExpect(view, 'データ無し');
		});
	});

	describe('pageCountLabel', () => {
		it('get', () => {
			const view = new BookInfoView(entity);
			const handleExpect = (view: BookInfoView, expectValue: string) => {
				expect(view.pageCountLabel).toBe(expectValue);
			};

			handleExpect(view, '300ページ');
			view.pageCount = 0;
			handleExpect(view, '0ページ');
			view.pageCount = undefined as unknown as number;
			handleExpect(view, '0ページ');
		});
	});

	describe('isDisplayableProgress', () => {
		const handleExpect = (view: BookInfoView, expectValue: boolean) => {
			expect(view.isDisplayableProgress).toBe(expectValue);
		};

		it('get', () => {
			const view = new BookInfoView(entity);

			handleExpect(view, true);
		});

		it('pageCount', () => {
			const view = new BookInfoView(entity);

			view.pageCount = 0;
			handleExpect(view, false);
		});

		it('pageHistory length', () => {
			const view = new BookInfoView(entity);

			view.pageHistories = undefined;
			handleExpect(view, false);
			view.pageHistories = [];
			handleExpect(view, false);
		});
	});

	describe('progressByPercent', () => {
		it('get', () => {
			const view = new BookInfoView(entity);

			expect(view.progressByPercent).toBe('3%');
		});
	});

	describe('getDateLabel', () => {
		it('get', () => {
			const handleExpect = (
				dateType: 'create' | 'update' | 'complete',
				useYear: boolean,
				expectValue: RegExp
			) => {
				const view = new BookInfoView(entity);
				expect(view.getDateLabel(dateType, useYear)).toMatch(expectValue);
			};

			handleExpect('create', true, /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpect('update', true, /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpect('complete', true, /データ無し/);
			handleExpect('create', false, /^\d{1,2}\/\d{1,2}$/);
		});
	});
});
