import { describe, it, expect, beforeEach } from "vitest";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { ObjectId } from "mongodb";
import * as testData from "../../../vitest-setup";

//toastはE2Eでテストする
describe.skip('applyChangesToBookInfos', () => {
  let testDatas: BookInfo[];
  beforeEach(() => {
    testDatas = testData.getTestDatas();
  })

  it('更新データがある際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(testDatas[1]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = testData.secondId;
    copy.isFavorite = true;
    copy.pageHistory!.push({
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testDatas, updateDetail, false);

    expect(result.length).toEqual(3);
    expect(result[1].isFavorite).toBeTruthy();
    expect(result[1].pageHistory!.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[0].isFavorite).toBeFalsy();
    expect(result[0].pageHistory!.length).toEqual(1);
    expect(result[2].isFavorite).toBeFalsy();
    expect(result[2].pageHistory!.length).toEqual(1);
  });

  it('更新対象が先頭の際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(testDatas[0]);
    copy._id = testData.firstId;
    copy.isFavorite = true;
    copy.pageHistory!.push({
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testDatas, updateDetail, false);

    expect(result.length).toEqual(3);
    expect(result[0].isFavorite).toBeTruthy();
    expect(result[0].pageHistory!.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[1].isFavorite).toBeFalsy();
    expect(result[1].pageHistory!.length).toEqual(1);
    expect(result[2].isFavorite).toBeFalsy();
    expect(result[2].pageHistory!.length).toEqual(1);
  });

  it('更新対象が末尾の際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(testDatas[2]);
    copy._id = testData.thirdId;
    copy.isFavorite = true;
    copy.pageHistory!.push({
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testDatas, updateDetail, false);

    expect(result.length).toEqual(3);
    expect(result[2].isFavorite).toBeTruthy();
    expect(result[2].pageHistory!.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[0].isFavorite).toBeFalsy();
    expect(result[0].pageHistory!.length).toEqual(1);
    expect(result[1].isFavorite).toBeFalsy();
    expect(result[1].pageHistory!.length).toEqual(1);
  });

  it('書誌データ1つの場合に、データが増加せずに更新されること', () => {
    const oneItems = [testDatas[0]];
    const copy = structuredClone(oneItems[0]);
    copy._id = testData.firstId;
    copy.isFavorite = true;
    copy.pageHistory!.push({
      id: crypto.randomUUID(),
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(oneItems, updateDetail, false);

    expect(result.length).toEqual(1);
    expect(result[0]).toBeTruthy();
  });

  it('書誌データのステータスが更新された際に、書誌データ一覧から削除されること', () => {
    const copy = structuredClone(testDatas[1]);
    copy._id = testData.secondId;
    copy.status = 'complete';

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testDatas, updateDetail, false);

    expect(result.length).toEqual(2);
  });

  it('書誌データのステータスが更新された際に、booksルートのページなら一覧から削除されないこと', () => {
    const copy = structuredClone(testDatas[1]);
    copy._id = testData.secondId;
    copy.status = 'complete';

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testDatas, updateDetail, true);

    expect(result.length).toEqual(3);
  });

  it('削除データがある際に、書誌データ一覧から削除されること', () => {
    const invalidDetail = {
      message: '', 
      updatedItem: undefined as unknown as BookInfo, 
      deletedId: testData.firstId
    };
    const result = applyChangesToBookInfos(testDatas, invalidDetail, false);

    expect(result.length).toEqual(2);
  });

  it('detailがFalthyな場合に、書誌データが変更されないこと', () => {
    const invalidDetail = {
      message: '', 
      updatedItem: undefined as unknown as BookInfo, 
      deletedId: undefined as unknown as ObjectId
    };
    const result = applyChangesToBookInfos(testDatas, invalidDetail, false);

    //同じ値か
    expect(result).toEqual(testDatas);
  });

});

//handleSuccessはE2Eでテストする

describe.skip('toggleFavorite', () => {
  let testDatas: BookInfo[];
  beforeEach(() => {
    testDatas = testData.getTestDatas();
  })

  it('フィルターのisCheckedがTrueの際に、お気に入りの書誌データのみisVisibleがTrueに変更されるか', () => {
    testDatas.forEach(item => item.isVisible = true);
    testDatas[0].isFavorite = true;
    const toggledItems = toggleFavorite(testDatas, {id: 1, text: 'お気に入り', type: 'favorite', isChecked: true, isVisible: true});

    expect(toggledItems[0].isVisible).toBeTruthy();
    expect(toggledItems[1].isVisible).toBeFalsy();
    expect(toggledItems[2].isVisible).toBeFalsy();
  });
  
  it('フィルターのisCheckedがFalseの際に、全データのisVisibleがTrueに変更されるか', () => {
    testDatas.forEach(item => item.isVisible = false);
    const toggledItems = toggleFavorite(testDatas, {id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true});

    expect(toggledItems[0].isVisible).toBeTruthy();
    expect(toggledItems[1].isVisible).toBeTruthy();
    expect(toggledItems[2].isVisible).toBeTruthy();
  });

  it('フィルターのタイプがfavorite以外の場合、データが変更されないこと', () => {
    const toggledItems = toggleFavorite(testDatas, {id: 1, text: '読みたい本', type: 'status', isChecked: false, isVisible: true});

    expect(toggledItems).toEqual(testDatas);
  });
});
