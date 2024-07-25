import { describe, expect, it } from "vitest";
import { convertReadingDateToDate } from "$lib/client/Utils/Date";
import { validateReadingCount, validateReadingDate } from "$lib/client/Utils/Validation";

describe('Date', () => {
  const year = 2024;
  const month = 7;
  const day = 15;
  const dateString = `${year}-${month}-${day}`;

  describe('convertReadingDateToDate', () => {
    it('inputタグの値をUTC形式のDate型に変換できること', () => {
      const convertedDate = convertReadingDateToDate(dateString);
      expect(convertedDate.getFullYear()).toEqual(year);
      expect(convertedDate.getMonth()).toEqual(month - 1);
      expect(convertedDate.getDate()).toEqual(day);
    })
  })
})

describe('PageHistory', () => {
  describe('getPageHistoryMapInCurrentWeek', () => {
    it('未作成', () => {
    })
  })
})

describe('Validation', () => {
  it('validateReadingDate', () => {
    const handleExpect = (readingDate: string, expectValue: boolean) => {
      const result = validateReadingDate(readingDate);
      expect(result).toBe(expectValue);
    }

    handleExpect('2023-10-30', true);
    handleExpect('', false);
  })

  it('validateReadingCount', () => {
    const handleExpect = (readingCount: number, pageCount: number, expectValue: boolean) => {
      const result = validateReadingCount(readingCount, pageCount);
      expect(result).toBe(expectValue);
    }

    handleExpect(0, 500, false);
    handleExpect(1, 500, true);
    handleExpect(250, 500, true);
    handleExpect(500, 500, true);
    handleExpect(NaN, 500, false);
    handleExpect(-1, 500, false);
    handleExpect(501, 500, false);
    handleExpect(1000, 500, false); 
  })
})