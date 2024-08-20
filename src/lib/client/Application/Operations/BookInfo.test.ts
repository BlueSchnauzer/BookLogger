import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { Status, type status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { bookInfoOperations } from '$lib/client/Application/Operations/BookInfo';
import { bookInfoInterfaceMock } from '$lib/mock/Data';
import { beforeEach, describe, expect, it } from 'vitest';

describe('BookInfo Operations', () => {
	let bookInfo: BookInfo;
	let operations: ReturnType<typeof bookInfoOperations>;
	beforeEach(() => {
		bookInfo = structuredClone(bookInfoInterfaceMock);
		operations = bookInfoOperations(bookInfo);
	});

	describe('addPageHistory', () => {
		it('add', () => {
			const result = operations.addPageHistory('2023-10-30', 100);

			expect(result.isError).toBeFalsy();
			expect(bookInfo.pageHistories?.length).toBe(3);
		});

		it('Falthyな日付文字列とページ数の場合にエラーステータスとメッセージが返ること', () => {
			let result = operations.addPageHistory('', 100);
			expect(result.isError).toBeTruthy();
			expect(result.errorMessage).toBe('日付が未入力です');

			result = operations.addPageHistory('2023-10-30', 0);
			expect(result.isError).toBeTruthy();
			expect(result.errorMessage).toBe(
				`ページ数は1～${bookInfo.pageCount}ページで入力してください`
			);
		});

		it('読んだ記録が0件の状態で追加された際に、ステータスがReadingに変わること', () => {
			const noPageHistoryBookInfo = { ...bookInfoInterfaceMock, pageHistories: [] };
			const noPageHistoryOperations = bookInfoOperations(noPageHistoryBookInfo);
			const result = noPageHistoryOperations.addPageHistory('2023-10-30', 100);

			expect(result.isError).toBeFalsy();
			expect(noPageHistoryBookInfo.status.value).toBe<status>('reading');
		});

		it('読んだ記録が0件の状態で追加された際に、ステータスがReadingに変わること', () => {
			const result = operations.addPageHistory('2023-10-30', bookInfo.pageCount);

			expect(result.isError).toBeFalsy();
			expect(bookInfo.status.value).toBe<status>('complete');
		});
	});

	describe('deletePageHistory', () => {
		it('delete', () => {
			const idToDelete = bookInfo.pageHistories![0].value.id!;
			operations.deletePageHistory(idToDelete);

			expect(bookInfo.pageHistories?.length).toBe(1);
		});
	});

	describe('addPageHistoryWhenComplete', () => {
		it('add', () => {
			bookInfo.status = new Status('complete');
			operations.addPageHistoryWhenComplete();

			expect(bookInfo.pageHistories?.length).toBe(3);
			expect(bookInfo.pageHistories![2].value.pageCount).toBe(bookInfo.pageCount);
			expect(bookInfo.status.value).toBe<status>('complete');
		});
	});
});
