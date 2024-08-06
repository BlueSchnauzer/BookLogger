import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import {
	handleBookInfosDeletion,
	handleBookInfosUpdate
} from '$lib/client/Helpers/CustomEvent/Handler';
import { convertInputDateToDate } from '$lib/client/Helpers/Date';
import { type industryIdentifiers, getIdentifier } from '$lib/client/Helpers/GoogleBooksAPI';
import { bookInfoInterfaceMock, bookInfoInterfaceMocks } from '$lib/mock/Data';
import { beforeEach, describe, expect, it } from 'vitest';

describe('handleBookInfoViewsUpdate', () => {
	let bookInfos: BookInfo[];
	beforeEach(() => {
		bookInfos = [...bookInfoInterfaceMocks];
	});

	it('更新データがある際に、対象の書誌データが更新されること', () => {
		const copiedData = structuredClone(bookInfos[1]);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate(bookInfos, {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(3);
		expect(result[1].isFavorite).toBeTruthy();
		expect(result[1].pageHistories?.length).toEqual(2);

		//対象以外が変更されていないか
		expect(result[0].isFavorite).toBeFalsy();
		expect(result[0].pageHistories?.length).toEqual(2);
		expect(result[2].isFavorite).toBeFalsy();
		expect(result[2].pageHistories?.length).toEqual(0);
	});

	it('更新対象が先頭の際に、対象の書誌データが更新されること', () => {
		const copiedData = structuredClone(bookInfos[0]);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate(bookInfos, {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(3);
		expect(result[0].isFavorite).toBeTruthy();
		expect(result[0].pageHistories!.length).toEqual(3);

		//対象以外が変更されていないか
		expect(result[1].isFavorite).toBeFalsy();
		expect(result[1].pageHistories!.length).toEqual(1);
		expect(result[2].isFavorite).toBeFalsy();
		expect(result[2].pageHistories!.length).toEqual(0);
	});

	it('更新対象が末尾の際に、対象の書誌データが更新されること', () => {
		const copiedData = structuredClone(bookInfos[2]);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate(bookInfos, {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(3);
		expect(result[2].isFavorite).toBeTruthy();
		expect(result[2].pageHistories!.length).toEqual(1);

		//対象以外が変更されていないか
		expect(result[0].isFavorite).toBeFalsy();
		expect(result[0].pageHistories!.length).toEqual(2);
		expect(result[1].isFavorite).toBeFalsy();
		expect(result[1].pageHistories!.length).toEqual(1);
	});

	it('書誌データ1つの場合に、データが増加せずに更新されること', () => {
		const bookInfo = bookInfoInterfaceMock;

		const copiedData = structuredClone(bookInfo);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate([bookInfo], {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(1);
		expect(result[0].isFavorite).toBeTruthy();
		expect(result[0].pageHistories?.length).toEqual(3);
	});
});

describe('handleBookInfoViewsDeletion', () => {
	let bookInfos: BookInfo[];
	beforeEach(() => {
		bookInfos = [...bookInfoInterfaceMocks];
	});

	it('削除データがある際に、書誌データ一覧から削除されること', () => {
		const result = handleBookInfosDeletion(bookInfos, {
			message: '削除',
			deletedId: bookInfos[0].id!
		});

		expect(result.length).toEqual(2);
		expect(result[0].id).toBe(bookInfos[1].id);
		expect(result[1].id).toBe(bookInfos[2].id);
	});

	// it('書誌データのステータスが更新された際に、書誌データ一覧から削除されること', () => {
	// 	const copy = structuredClone(views[1]);
	// 	copy._id = testData.secondId;
	// 	copy.status = 'complete';

	// 	const updateDetail = {
	// 		message: '',
	// 		updatedItem: copy,
	// 		deletedId: undefined as unknown as ObjectId
	// 	};
	// 	const result = applyChangesToBookInfos(testDatas, updateDetail, false);

	// 	expect(result.length).toEqual(2);
	// });

	// it('書誌データのステータスが更新された際に、booksルートのページなら一覧から削除されないこと', () => {
	// 	const copy = structuredClone(testDatas[1]);
	// 	copy._id = testData.secondId;
	// 	copy.status = 'complete';

	// 	const updateDetail = {
	// 		message: '',
	// 		updatedItem: copy,
	// 		deletedId: undefined as unknown as ObjectId
	// 	};
	// 	const result = applyChangesToBookInfos(testDatas, updateDetail, true);

	// 	expect(result.length).toEqual(3);
	// });
});

describe('Date', () => {
	const year = 2024;
	const month = 7;
	const day = 15;
	const dateString = `${year}-${month}-${day}`;

	it('convertInputDateToDate', () => {
		const convertedDate = convertInputDateToDate(dateString);
		expect(convertedDate.getFullYear()).toEqual(year);
		expect(convertedDate.getMonth()).toEqual(month - 1);
		expect(convertedDate.getDate()).toEqual(day);
	});

	it('getCurrentDateString', () => {});
});

describe('GoogleBooksAPI', () => {
	it('getIdentifiers', () => {
		const handleExpect = (
			isbns: industryIdentifiers,
			type: 'ISBN_13' | 'ISBN_10',
			expectValue: string
		) => {
			const identifiers = getIdentifier(isbns);

			const isbn = type === 'ISBN_13' ? identifiers?.isbn_13 : identifiers?.isbn_10;
			expect(isbn).toBe(expectValue);
		};

		const isbn13 = [{ identifier: '978-4-15-120051-9', type: 'ISBN_13' }];
		handleExpect(isbn13, 'ISBN_13', isbn13[0].identifier);
		const isbn10 = [{ identifier: '4-123456-78-9', type: 'ISBN_10' }];
		handleExpect(isbn10, 'ISBN_10', isbn10[0].identifier);
	});
});
