import { describe, it, expect, beforeEach } from "vitest";
import * as utils from '$lib/utils';
import type { BookInfo } from "$lib/server/models/BookInfo";
import { ObjectId } from "mongodb";

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

describe('applyChangesToBookInfos', () => {
  const firstId = new ObjectId('a123456789b123456789c123');
  const secondId = new ObjectId('A123456789B123456789C123');
  const thirdId = new ObjectId('b123456789c123456789d123');

  let bookInfos : BookInfo[];

  beforeEach(() => {
    bookInfos = [
      {
          _id: firstId,
          userId: 1,
          isVisible: true,
          identifier: {
            isbn_13: '978-4-15-031316-6'
          },
          title: 'エピローグ',
          author: ['円城塔'],
          thumbnail: '',
          createDate: new Date,
          updateDate: new Date,
          pageCount: -1,
          history: [{
              date: new Date,
              currentPage: 0
          }],
          isFavorite: false,
          isCompleted: false,
          memorandum: ''
      },
      {
          _id: secondId,
          userId: 1,
          isVisible: true,
          identifier: {
            isbn_13: '978-4-16-791019-8'
          },
          title: 'プロローグ',
          author: ['円城塔'],
          thumbnail: '',
          createDate: new Date,
          updateDate: new Date,
          pageCount: -1,
          history: [{
              date: new Date,
              currentPage: 0
          }],
          isFavorite: false,
          isCompleted: false,
          memorandum: ''
      },
      {
        _id: thirdId,
        userId: 1,
        isVisible: true,
        identifier: {
          isbn_13: ''
        },
        title: '3冊目',
        author: ['テスト'],
        thumbnail: '',
        createDate: new Date,
        updateDate: new Date,
        pageCount: -1,
        history: [{
            date: new Date,
            currentPage: 0
        }],
        isFavorite: false,
        isCompleted: false,
        memorandum: ''
      },
    ]
  });

  it('更新データがある際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(bookInfos[1]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = secondId;
    copy.isFavorite = true;
    copy.history.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = utils.applyChangesToBookInfos(bookInfos, updateDetail);

    expect(result.length).toEqual(3);
    expect(result[1].isFavorite).toBeTruthy();
    expect(result[1].history.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[0].isFavorite).toBeFalsy();
    expect(result[0].history.length).toEqual(1);
    expect(result[2].isFavorite).toBeFalsy();
    expect(result[2].history.length).toEqual(1);
  });

  it('更新対象が先頭の際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(bookInfos[0]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = firstId;
    copy.isFavorite = true;
    copy.history.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = utils.applyChangesToBookInfos(bookInfos, updateDetail);

    expect(result.length).toEqual(3);
    expect(result[0].isFavorite).toBeTruthy();
    expect(result[0].history.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[1].isFavorite).toBeFalsy();
    expect(result[1].history.length).toEqual(1);
    expect(result[2].isFavorite).toBeFalsy();
    expect(result[2].history.length).toEqual(1);
  });

  it('更新対象が末尾の際に、対象の書誌データが更新されること', () => {
    const copy = structuredClone(bookInfos[2]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = thirdId;
    copy.isFavorite = true;
    copy.history.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = utils.applyChangesToBookInfos(bookInfos, updateDetail);

    expect(result.length).toEqual(3);
    expect(result[2].isFavorite).toBeTruthy();
    expect(result[2].history.length).toEqual(2);

    //対象以外が変更されていないか
    expect(result[0].isFavorite).toBeFalsy();
    expect(result[0].history.length).toEqual(1);
    expect(result[1].isFavorite).toBeFalsy();
    expect(result[1].history.length).toEqual(1);
  });

  it('書誌データ1つの場合に、データが増加せずに更新されること', () => {
    const oneItems = [bookInfos[0]];
    const copy = structuredClone(oneItems[0]);
    //コード上でObjectIdを作った場合、structuredCloneでコピーできないので再設定
    //DBから取得した場合は内部のプロパティが無いので対応不要
    copy._id = firstId;
    copy.isFavorite = true;
    copy.history.push({
      date: new Date,
      currentPage: 50
    });

    const updateDetail = {
      message: '', 
      updatedItem: copy,
      deletedId: undefined as unknown as ObjectId
    };
    const result = utils.applyChangesToBookInfos(oneItems, updateDetail);

    expect(result.length).toEqual(1);
    expect(result[0]).toBeTruthy();
  });


  it('削除データがある際に、書誌データから削除されること', () => {
    const invalidDetail = {
      message: '', 
      updatedItem: undefined as unknown as BookInfo, 
      deletedId: firstId
    };
    const result = utils.applyChangesToBookInfos(bookInfos, invalidDetail);

    expect(result.length).toEqual(2);
  });

  it('detailがFalthyな場合に、書誌データが変更されないこと', () => {
    const invalidDetail = {
      message: '', 
      updatedItem: undefined as unknown as BookInfo, 
      deletedId: undefined as unknown as ObjectId
    };
    const result = utils.applyChangesToBookInfos(bookInfos, invalidDetail);

    //同じ値か
    expect(result).toEqual(bookInfos);
  });

});

//handleSuccessはE2Eでテストする

describe('toggleFavorite', () => {
  const firstId = new ObjectId('a123456789b123456789c123');
  const secondId = new ObjectId('A123456789B123456789C123');
  const thirdId = new ObjectId('b123456789c123456789d123');

  let bookInfos : BookInfo[];

  beforeEach(() => {
    bookInfos = [
      {
          _id: firstId,
          userId: 1,
          isVisible: true,
          identifier: {
            isbn_13: '978-4-15-031316-6'
          },
          title: 'エピローグ',
          author: ['円城塔'],
          thumbnail: '',
          createDate: new Date,
          updateDate: new Date,
          pageCount: -1,
          history: [{
              date: new Date,
              currentPage: 0
          }],
          isFavorite: true,
          isCompleted: false,
          memorandum: ''
      },
      {
          _id: secondId,
          userId: 1,
          isVisible: true,
          identifier: {
            isbn_13: '978-4-16-791019-8'
          },
          title: 'プロローグ',
          author: ['円城塔'],
          thumbnail: '',
          createDate: new Date,
          updateDate: new Date,
          pageCount: -1,
          history: [{
              date: new Date,
              currentPage: 0
          }],
          isFavorite: true,
          isCompleted: false,
          memorandum: ''
      },
      {
        _id: thirdId,
        userId: 1,
        isVisible: true,
        identifier: {
          isbn_13: ''
        },
        title: '3冊目',
        author: ['テスト'],
        thumbnail: '',
        createDate: new Date,
        updateDate: new Date,
        pageCount: -1,
        history: [{
            date: new Date,
            currentPage: 0
        }],
        isFavorite: false,
        isCompleted: false,
        memorandum: ''
      },
    ]
  });

  it('フィルターのisCheckedがTrueの際に、お気に入りの書誌データのみisVisibleがTrueに変更されるか', () => {
    bookInfos.forEach(item => item.isVisible = true);
    const toggledItems = utils.toggleFavorite(bookInfos, {id: 1, text: 'お気に入り', type: 'favorite', isChecked: true, isVisible: true});

    expect(toggledItems[0].isVisible).toBeTruthy();
    expect(toggledItems[1].isVisible).toBeTruthy();
    expect(toggledItems[2].isVisible).toBeFalsy();
  });
  
  it('フィルターのisCheckedがFalseの際に、全データのisVisibleがTrueに変更されるか', () => {
    bookInfos.forEach(item => item.isVisible = false);
    const toggledItems = utils.toggleFavorite(bookInfos, {id: 1, text: 'お気に入り', type: 'favorite', isChecked: false, isVisible: true});

    expect(toggledItems[0].isVisible).toBeTruthy();
    expect(toggledItems[1].isVisible).toBeTruthy();
    expect(toggledItems[2].isVisible).toBeTruthy();
  });

  it('フィルターのタイプがfavorite以外の場合、データが変更されないこと', () => {
    const toggledItems = utils.toggleFavorite(bookInfos, {id: 1, text: '読みたい本', type: 'status', isChecked: false, isVisible: true});

    expect(toggledItems).toEqual(bookInfos);
  });
});