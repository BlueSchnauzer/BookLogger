import { describe, it, expect, beforeEach } from "vitest";
import type { BookInfo } from "$lib/server/models/BookInfo";
import type { ObjectId } from "mongodb";
import * as testData from "../vitest-setup";

import { applyChangesToBookInfos, convertDate, getTypeForBottomLabel, toggleFavorite } from "$lib/utils/bookInfo";
import { validateReadingCount, validateReadingDate } from "$lib/utils/validation";

describe('convertDate', () => {
  const testDate = new Date(2023, 5, 15);

  it('Dateを渡した際に(年)月日の形式で返すこと', () => {
    const resultWithYear = convertDate(testDate);
    expect(resultWithYear).toEqual('2023/6/15');
    
    const resultWithoutYear = convertDate(testDate, false);
    expect(resultWithoutYear).toEqual('6/15');
  });

  it('データがundefinedの場合に、データ無しの文字列が返ること', () => {
    const invalidData = undefined;
    const result = convertDate(invalidData as unknown as Date);

    expect(result).toEqual('データ無し');
  });

  it('データが文字列の際でも変換できること', () => {
    const dateString = testDate.toUTCString();
    const result = convertDate(dateString);
    
    expect(result).toEqual('2023/6/15');
  });
});

//toastはE2Eでテストする

describe('applyChangesToBookInfos', () => {
  it('更新データがある際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(testData.threeBookInfos[1]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = testData.secondId;
    copy.isFavorite = true;
    copy.history!.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testData.threeBookInfos, updateDetail);

    expect(result.length).toEqual(3);
    expect(result[1].isFavorite).toBeTruthy();
    expect(result[1].history!.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[0].isFavorite).toBeFalsy();
    expect(result[0].history!.length).toEqual(1);
    expect(result[2].isFavorite).toBeFalsy();
    expect(result[2].history!.length).toEqual(1);
  });

  it('更新対象が先頭の際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(testData.threeBookInfos[0]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = testData.firstId;
    copy.isFavorite = true;
    copy.history!.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testData.threeBookInfos, updateDetail);

    expect(result.length).toEqual(3);
    expect(result[0].isFavorite).toBeTruthy();
    expect(result[0].history!.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[1].isFavorite).toBeFalsy();
    expect(result[1].history!.length).toEqual(1);
    expect(result[2].isFavorite).toBeFalsy();
    expect(result[2].history!.length).toEqual(1);
  });

  it('更新対象が末尾の際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(testData.threeBookInfos[2]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = testData.thirdId;
    copy.isFavorite = true;
    copy.history!.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testData.threeBookInfos, updateDetail);

    expect(result.length).toEqual(3);
    expect(result[2].isFavorite).toBeTruthy();
    expect(result[2].history!.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[0].isFavorite).toBeFalsy();
    expect(result[0].history!.length).toEqual(1);
    expect(result[1].isFavorite).toBeFalsy();
    expect(result[1].history!.length).toEqual(1);
  });

  it('書誌データ1つの場合に、データが増加せずに更新されること', () => {
    const oneItems = [testData.threeBookInfos[0]];
    const copy = structuredClone(oneItems[0]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = testData.firstId;
    copy.isFavorite = true;
    copy.history!.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(oneItems, updateDetail);

    expect(result.length).toEqual(1);
    expect(result[0]).toBeTruthy();
  });


  it('削除データがある際に、書誌データから削除されること', () => {
    const invalidDetail = {
      message: '', 
      updatedItem: undefined as unknown as BookInfo, 
      deletedId: testData.firstId
    };
    const result = applyChangesToBookInfos(testData.threeBookInfos, invalidDetail);

    expect(result.length).toEqual(2);
  });

  it('detailがFalthyな場合に、書誌データが変更されないこと', () => {
    const invalidDetail = {
      message: '', 
      updatedItem: undefined as unknown as BookInfo, 
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testData.threeBookInfos, invalidDetail);

    //同じ値か
    expect(result).toEqual(testData.threeBookInfos);
  });

});

//handleSuccessはE2Eでテストする

describe('toggleFavorite', () => {
  it('フィルターのisCheckedがTrueの際に、お気に入りの書誌データのみisVisibleがTrueに変更されるか', () => {
    testData.threeBookInfos.forEach(item => item.isVisible = true);
    testData.threeBookInfos[0].isFavorite = true;
    const toggledItems = toggleFavorite(testData.threeBookInfos, {id: 1, text: 'お気に入り', type: 'favorite', isChecked: true, isVisible: true});

    expect(toggledItems[0].isVisible).toBeTruthy();
    expect(toggledItems[1].isVisible).toBeFalsy();
    expect(toggledItems[2].isVisible).toBeFalsy();
  });
  
  it('フィルターのisCheckedがFalseの際に、全データのisVisibleがTrueに変更されるか', () => {
    testData.threeBookInfos.forEach(item => item.isVisible = false);
    const toggledItems = toggleFavorite(testData.threeBookInfos, {id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true});

    expect(toggledItems[0].isVisible).toBeTruthy();
    expect(toggledItems[1].isVisible).toBeTruthy();
    expect(toggledItems[2].isVisible).toBeTruthy();
  });

  it('フィルターのタイプがfavorite以外の場合、データが変更されないこと', () => {
    const toggledItems = toggleFavorite(testData.threeBookInfos, {id: 1, text: '読みたい本', type: 'status', isChecked: false, isVisible: true});

    expect(toggledItems).toEqual(testData.threeBookInfos);
  });
});

describe('getTypeForBottomLabel', () => {
  it('ホームのパスでupdateDateが返ること', () => {
    const result = getTypeForBottomLabel('/books');
    expect(result).toEqual('updateDate');
  });

  it('読んでいる本のパスでprogressが返ること', () => {
    const result = getTypeForBottomLabel('/books/reading');
    expect(result).toEqual('progress');
  });

  it('読み終わった本のパスでcompleteDateが返ること', () => {
    const result = getTypeForBottomLabel('/books/complete');
    expect(result).toEqual('completeDate');
  });

  it('その他のパスでcreateDateが返ること', () => {
    const result = getTypeForBottomLabel('/books/wish');
    expect(result).toEqual('createDate');
  });
});

describe('validateReadingDate', () => {
  it('データがTruthyかどうか判定できること', () => {
    const validData = '2023-10-30';
    const result = validateReadingDate(validData);

    expect(result).toBeTruthy();
  });

  it('データがFalthyかどうか判定できること', () => {
    const invalidData = '';
    const result = validateReadingDate(invalidData);

    expect(result).toBeFalsy();
  });
});

describe('validateReadingCount', () => {
  it('データが1～pageCountの間の場合に、trueが返ってくること', () => {
    const resultWith1 = validateReadingCount(1, 500);
    const resultWith250 = validateReadingCount(250, 500);
    const resultWith500 = validateReadingCount(500, 500);

    expect(resultWith1).toBeTruthy();
    expect(resultWith250).toBeTruthy();
    expect(resultWith500).toBeTruthy();
  });

  it('データがFalthyかどうか判定できること', () => {
    const invalidData = Number(undefined);
    const result = validateReadingCount(invalidData, 500);

    expect(result).toBeFalsy();
  });

  it('データが0以下の場合にfalseが返ってくること', () => {
    const resultWith0 = validateReadingCount(0, 500);
    const resultWithMinus1 = validateReadingCount(-1, 500);
    
    expect(resultWith0).toBeFalsy();
    expect(resultWithMinus1).toBeFalsy();
  });
  
  it('データがpageCountより大きい場合にfalseが返ってくること', () => {
    const resultWithOver1 = validateReadingCount(501, 500);
    const resultWithPower = validateReadingCount(1000, 500);
    
    expect(resultWithOver1).toBeFalsy();
    expect(resultWithPower).toBeFalsy();
  });
});
