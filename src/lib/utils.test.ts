import { describe, it, expect } from "vitest";
import * as utils from '$lib/utils';
import type { BookInfo } from "$lib/server/models/BookInfo";

describe('convertDate', () => {
  const testDate = new Date(2023, 5, 15);

  it('Dateを渡した際に(年)月日の形式で返すこと', () => {
    const resultWithYear = utils.convertDate(testDate);
    expect(resultWithYear).toEqual('2023/6/15');
    
    const resultWithoutYear = utils.convertDate(testDate, false);
    expect(resultWithoutYear).toEqual('6/15');
  });

  it('データがundefinedの場合に、データ無しの文字列が返ること', () => {
    const invalidData = undefined;
    const result = utils.convertDate(invalidData as unknown as Date);

    expect(result).toEqual('データ無し');
  });

  it('データが文字列の際でも変換できること', () => {
    const dateString = testDate.toUTCString();
    const result = utils.convertDate(dateString);
    
    expect(result).toEqual('2023/6/15');
  });
});

describe('validateReadingDate', () => {
  it('データがTruthyかどうか判定できること', () => {
    const validData = '2023-10-30';
    const result = utils.validateReadingDate(validData);

    expect(result).toBeTruthy();
  });

  it('データがFalthyかどうか判定できること', () => {
    const invalidData = '';
    const result = utils.validateReadingDate(invalidData);

    expect(result).toBeFalsy();
  });
});

describe('validateReadingCount', () => {
  it('データが1～pageCountの間の場合に、trueが返ってくること', () => {
    const resultWith1 = utils.validateReadingCount(1, 500);
    const resultWith250 = utils.validateReadingCount(250, 500);
    const resultWith500 = utils.validateReadingCount(500, 500);

    expect(resultWith1).toBeTruthy();
    expect(resultWith250).toBeTruthy();
    expect(resultWith500).toBeTruthy();
  });

  it('データがFalthyかどうか判定できること', () => {
    const invalidData = Number(undefined);
    const result = utils.validateReadingCount(invalidData, 500);

    expect(result).toBeFalsy();
  });

  it('データが0以下の場合にfalseが返ってくること', () => {
    const resultWith0 = utils.validateReadingCount(0, 500);
    const resultWithMinus1 = utils.validateReadingCount(-1, 500);
    
    expect(resultWith0).toBeFalsy();
    expect(resultWithMinus1).toBeFalsy();
  });
  
  it('データがpageCountより大きい場合にfalseが返ってくること', () => {
    const resultWithOver1 = utils.validateReadingCount(501, 500);
    const resultWithPower = utils.validateReadingCount(1000, 500);
    
    expect(resultWithOver1).toBeFalsy();
    expect(resultWithPower).toBeFalsy();
  });
});

//toastはE2Eでテストする

//handleSuccessはE2Eでテストする