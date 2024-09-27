import { PageHistory } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Shared/Utils/PageHistory';
import { validateReadingCount, validateReadingDate } from '$lib/client/Shared/Utils/Validation';
import { describe, expect, it } from 'vitest';

describe('PageHistory', () => {
	//本日から1週間前までの7日間のDate配列を作成
	const today = new Date();
	const weekDays: Date[] = [];
	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		weekDays.push(date);
	}

	it('getPageHistoryMapInCurrentWeek', () => {
		const pageHistoriesArray: PageHistory[][] = [];
		weekDays.map((item, index) => {
			const pageHistories: PageHistory[] = [];
			pageHistories.push(new PageHistory({ date: item, pageCount: 100 * index }));
			pageHistoriesArray.push(pageHistories);
		});

		const pageHistoryMap = getPageHistoryMapInCurrentWeek(pageHistoriesArray);
		weekDays.forEach((item, index) => {
			expect(pageHistoryMap.get(item.toLocaleDateString('ja-JP'))).toBe(100 * index);
		});
	});
});

describe('Validation', () => {
	it('validateReadingDate', () => {
		const handleExpect = (readingDate: string, expectValue: boolean) => {
			const result = validateReadingDate(readingDate);
			expect(result).toBe(expectValue);
		};

		handleExpect('2023-10-30', true);
		handleExpect('', false);
	});

	it('validateReadingCount', () => {
		const handleExpect = (readingCount: number, pageCount: number, expectValue: boolean) => {
			const result = validateReadingCount(readingCount, pageCount);
			expect(result).toBe(expectValue);
		};

		handleExpect(0, 500, false);
		handleExpect(1, 500, true);
		handleExpect(250, 500, true);
		handleExpect(500, 500, true);
		handleExpect(NaN, 500, false);
		handleExpect(-1, 500, false);
		handleExpect(501, 500, false);
		handleExpect(1000, 500, false);
	});

	// it('validatePutBookInfo', () => {
	// 	throw new Error('not implement');
	// });
});
