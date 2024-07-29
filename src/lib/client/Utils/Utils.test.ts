import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { convertReadingDateToDate } from '$lib/client/Utils/Date';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Utils/PageHistory';
import { validateReadingCount, validateReadingDate } from '$lib/client/Utils/Validation';
import { describe, expect, it } from 'vitest';

describe('Date', () => {
	const year = 2024;
	const month = 7;
	const day = 15;
	const dateString = `${year}-${month}-${day}`;

	it('convertReadingDateToDate', () => {
		const convertedDate = convertReadingDateToDate(dateString);
		expect(convertedDate.getFullYear()).toEqual(year);
		expect(convertedDate.getMonth()).toEqual(month - 1);
		expect(convertedDate.getDate()).toEqual(day);
	});
});

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
});
