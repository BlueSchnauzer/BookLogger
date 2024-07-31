import { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { Status, type status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { bookInfoPropertiesMock, getEntityTestData } from '$lib/mock/Data';
import { describe, expect, it } from 'vitest';
import { BookInfoView } from './BookInfo';

describe('BookInfoView', () => {
	describe('initialize', () => {
		it('properties', () => {
			const entity = getEntityTestData();
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
		it('get label', () => {
			const entity = getEntityTestData();
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
		it('get label', () => {
			const entity = getEntityTestData();
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
		const entity = getEntityTestData();
		const handleExpect = (view: BookInfoView, expectValue: boolean) => {
			expect(view.isDisplayableProgress).toBe(expectValue);
		};

		it('get', () => {
			const view = new BookInfoView(entity);

			handleExpect(view, true);
		});

		it('falthy pageCount', () => {
			const view = new BookInfoView(entity);

			view.pageCount = 0;
			handleExpect(view, false);
		});

		it('falthy pageHistory length', () => {
			const view = new BookInfoView(entity);

			view.pageHistories = undefined;
			handleExpect(view, false);
			view.pageHistories = [];
			handleExpect(view, false);
		});
	});

	describe('progressByPercent', () => {
		it('get percent', () => {
			const entity = getEntityTestData();
			const view = new BookInfoView(entity);

			expect(view.progressByPercent).toBe('3%');
		});
	});

	describe('getDateLabel', () => {
		it('get label by type', () => {
			const handleExpect = (
				dateType: 'create' | 'update' | 'complete',
				useYear: boolean,
				expectValue: RegExp
			) => {
				const entity = getEntityTestData();
				const view = new BookInfoView(entity);
				expect(view.getDateLabel(dateType, useYear)).toMatch(expectValue);
			};

			handleExpect('create', true, /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpect('update', true, /^\d{4}\/\d{1,2}\/\d{1,2}$/);
			handleExpect('complete', true, /データ無し/);
			handleExpect('create', false, /^\d{1,2}\/\d{1,2}$/);
		});
	});

	describe('getTypeForBottomLabel', () => {
		it('get label by type', () => {
			const handleExpect = (pathName: string, expectValue: string) => {
				const entity = getEntityTestData();
				const view = new BookInfoView(entity);
				expect(view.getTypeForBottomLabel(pathName)).toBe(expectValue);
			};

			handleExpect('/home', 'progress');
			handleExpect('/books', 'createDate');
			handleExpect('/books/wish', 'createDate');
			handleExpect('/books/reading', 'progress');
			handleExpect('', 'completeDate');
		});
	});

	describe('addPageHistory', () => {
		const entity = getEntityTestData();
		it('add', () => {
			const view = new BookInfoView(entity);
			const result = view.addPageHistory('2023-10-30', 100);

			expect(result.isSuccess).toBeTruthy();
			expect(view.pageHistories?.length).toBe(3);
		});

		it('Falthyな日付文字列とページ数の場合にエラーステータスとメッセージが返ること', () => {
			const view = new BookInfoView(entity);
			let result = view.addPageHistory('', 100);
			expect(result.isSuccess).toBeFalsy();
			expect(result.errorMessage).toBe('日付が未入力です');

			result = view.addPageHistory('2023-10-30', 0);
			expect(result.isSuccess).toBeFalsy();
			expect(result.errorMessage).toBe(`ページ数は1～${view.pageCount}ページで入力してください`);
		});

		it('読んだ記録が0件の状態で追加された際に、ステータスがReadingに変わること', () => {
			const noPageHistoryEntity = new BookInfo({ ...bookInfoPropertiesMock, pageHistories: [] });
			const view = new BookInfoView(noPageHistoryEntity);
			const result = view.addPageHistory('2023-10-30', 100);

			expect(result.isSuccess).toBeTruthy();
			expect(view.status.value).toBe<status>('reading');
		});

		it('読んだ記録が0件の状態で追加された際に、ステータスがReadingに変わること', () => {
			const view = new BookInfoView(entity);
			const result = view.addPageHistory('2023-10-30', view.pageCount);

			expect(result.isSuccess).toBeTruthy();
			expect(view.status.value).toBe<status>('complete');
		});
	});

	describe('deletePageHistory', () => {
		it('delete', () => {
			const entity = getEntityTestData();
			const view = new BookInfoView(entity);
			const idToDelete = view.pageHistories![0].value.id!;
			view.deletePageHistory(idToDelete);

			expect(view.pageHistories?.length).toBe(1);
		});
	});

	describe('addPageHistoryWhenComplete', () => {
		it('add', () => {
			const entity = getEntityTestData();
			const view = new BookInfoView(entity);
			view.status = new Status('complete');
			view.addPageHistoryWhenComplete();

			expect(view.pageHistories?.length).toBe(3);
			expect(view.pageHistories![2].value.pageCount).toBe(view.pageCount);
			expect(view.status.value).toBe<status>('complete');
		});
	});
});
