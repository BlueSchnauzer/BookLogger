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
import type { BookInfoResponseItem } from '../Application/Interface';
import { bookInfoView } from '../Application/Views/BookInfo';

describe('handleBookInfoViewsUpdate', () => {
	let responseItems: BookInfoResponseItem[];
	beforeEach(() => {
		const bookInfos = [...bookInfoInterfaceMocks];
		responseItems = bookInfos.map((entity) => {
			const view = bookInfoView(entity);
			return { entity, view };
		});
	});

	it('更新データがある際に、対象の書誌データが更新されること', () => {
		//これでコピーできてる？
		const copiedData = structuredClone(responseItems[1].entity);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate(responseItems, {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(3);
		expect(result[1].entity.isFavorite).toBeTruthy();
		expect(result[1].entity.pageHistories?.length).toEqual(2);
		expect(result[1].view.getTitleLabel()).toBeDefined();

		//対象以外が変更されていないか
		expect(result[0].entity.isFavorite).toBeFalsy();
		expect(result[0].entity.pageHistories?.length).toEqual(2);
		expect(result[0].view.getTitleLabel()).toBeDefined();
		expect(result[2].entity.isFavorite).toBeFalsy();
		expect(result[2].entity.pageHistories?.length).toEqual(0);
		expect(result[2].view.getTitleLabel()).toBeDefined();
	});

	it('更新対象が先頭の際に、対象の書誌データが更新されること', () => {
		const copiedData = structuredClone(responseItems[0].entity);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate(responseItems, {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(3);
		expect(result[0].entity.isFavorite).toBeTruthy();
		expect(result[0].entity.pageHistories?.length).toEqual(3);
		expect(result[0].view.getTitleLabel()).toBeDefined();

		//対象以外が変更されていないか
		expect(result[1].entity.isFavorite).toBeFalsy();
		expect(result[1].entity.pageHistories?.length).toEqual(1);
		expect(result[1].view.getTitleLabel()).toBeDefined();
		expect(result[2].entity.isFavorite).toBeFalsy();
		expect(result[2].entity.pageHistories?.length).toEqual(0);
		expect(result[2].view.getTitleLabel()).toBeDefined();
	});

	it('更新対象が末尾の際に、対象の書誌データが更新されること', () => {
		const copiedData = structuredClone(responseItems[2].entity);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const result = handleBookInfosUpdate(responseItems, {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(3);
		expect(result[2].entity.isFavorite).toBeTruthy();
		expect(result[2].entity.pageHistories?.length).toEqual(1);
		expect(result[2].view.getTitleLabel()).toBeDefined();

		//対象以外が変更されていないか
		expect(result[0].entity.isFavorite).toBeFalsy();
		expect(result[0].entity.pageHistories?.length).toEqual(2);
		expect(result[0].view.getTitleLabel()).toBeDefined();
		expect(result[1].entity.isFavorite).toBeFalsy();
		expect(result[1].entity.pageHistories?.length).toEqual(1);
		expect(result[1].view.getTitleLabel()).toBeDefined();
	});

	it('書誌データ1つの場合に、データが増加せずに更新されること', () => {
		const bookInfo = bookInfoInterfaceMock;

		const copiedData = structuredClone(bookInfo);
		copiedData.isFavorite = true;
		copiedData.pageHistories?.push(new PageHistory({ date: new Date(), pageCount: 100 }));

		const responseItem = { entity: bookInfo, view: bookInfoView(bookInfo) };
		const result = handleBookInfosUpdate([responseItem], {
			message: '更新成功',
			updatedItem: copiedData
		});

		expect(result.length).toEqual(1);
		expect(result[0].entity.isFavorite).toBeTruthy();
		expect(result[0].entity.pageHistories?.length).toEqual(3);
		expect(result[0].view.getTitleLabel()).toBeDefined();
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
