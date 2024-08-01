import { describe, expect, it } from "vitest";
import { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import { Identifiers } from "$lib/server/Domain/ValueObjects/BookInfo/Identifier";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";
import { PageHistory, type pageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";
import { Id } from "./Id";
import { Status, type status } from "./Status";

describe('Id', () => {
  const testId = 'testId';

  it('対応した型の値を渡すことでその値を持ったValueObjectを生成できること', () => {
    const id = new Id(testId);

    expect(id).not.toBeUndefined();
    expect(id.value).toEqual(testId);
  });

  it('Falthyな値もしくはstring以外の値を渡した際にエラーが発生すること', () => {
    expect(() => new Id('')).toThrowError(ValidationError);
    expect(() => new Id(1000 as unknown as string)).toThrowError(ValidationError);
  });

  it('equals()でValueObject同士の値を比較できること', () => {
    const test1 = new Id('TestA');
    const test2 = new Id('TestA');
    const test3 = new Id('TestB');

    expect(test1.equals(test2)).toBeTruthy();
    expect(test1.equals(test3)).toBeFalsy();
  });
});

describe('Identifier', () => {
  const isbn_13 = '978-4-15-120051-9';
  const isbn_10 = '4-15-031316-6';

  it('対応した型の値を渡すことでその値を持ったValueObjectを生成できること', () => {
    const identifiers = new Identifiers({isbn_13, isbn_10});

    expect(identifiers).not.toBeUndefined();
    expect(identifiers.value.isbn_13).toEqual(isbn_13);
    expect(identifiers.value.isbn_10).toEqual(isbn_10);
  });

  it('Falthyな値もしくはstring以外の値を渡した際にエラーが発生すること', () => {
    expect(() => new Identifiers({})).toThrowError(ValidationError);
    expect(() => new Identifiers({isbn_13: 10 as unknown as string})).toThrowError(ValidationError);
  });

  it('ISBNの片方のみにデータが入っている場合でもIdentifiersが生成できること', () => {
    const idWithIsbn13 = new Identifiers({isbn_13});
    const idWithIsbn10 = new Identifiers({isbn_10});

    expect(idWithIsbn13).not.toBeUndefined();
    expect(idWithIsbn13.value.isbn_13).toEqual(isbn_13);
    expect(idWithIsbn13.value.isbn_10).toBeUndefined();

    expect(idWithIsbn10).not.toBeUndefined();
    expect(idWithIsbn10.value.isbn_10).toEqual(isbn_10);
    expect(idWithIsbn10.value.isbn_13).toBeUndefined();
  });

  it('equals()でValueObject同士の値を比較できること', () => {
    const idWithIsbn13A = new Identifiers({isbn_13});
    const idWithIsbn13B = new Identifiers({isbn_13});
    const idWithIsbn10 = new Identifiers({isbn_10});

    expect(idWithIsbn13A.equals(idWithIsbn13B)).toBeTruthy();
    expect(idWithIsbn13A.equals(idWithIsbn10)).toBeFalsy();
  });
});

describe('PageHistory', () => {
  const data = [
    {
      id: crypto.randomUUID(),
      date: new Date,
      pageCount: 0
    }
  ];

  it('対応した型の値を渡すことでその値を持ったValueObjectを生成できること', () => {
    const pageHistory = data.map(item => new PageHistory(item));

    expect(pageHistory[0].value.id).toEqual(data[0].id);
    expect(pageHistory[0].value.date).toEqual(data[0].date);
    expect(pageHistory[0].value.pageCount).toEqual(data[0].pageCount);
  });

  it('Falthyな値を渡した際にエラーが発生すること', () => {
    expect(() => new PageHistory({} as pageHistory)).toThrowError(ValidationError);
  });

  it('idにstring以外の型を指定した場合にエラーが発生すること', () => {
    expect(() => new PageHistory({id: 1000, date: new Date(), pageCount: 0} as unknown as pageHistory)).toThrowError(ValidationError);
  });

  it('dateにDate型もしくはDateを変換したString以外の型を指定した場合にエラーが発生すること', () => {
    //エラーになること
    expect(() => new PageHistory({id: 1000, date: 1000, pageCount: 0} as unknown as pageHistory)).toThrowError(ValidationError);

    //日付を文字列に変換したものは、再度Date型に変換してValueObjectを生成できること
    const date = new Date();
    const dateString = date.toJSON();
    let pageHistory: PageHistory;

    expect(() => {
      pageHistory = new PageHistory({id: crypto.randomUUID(), date: dateString, pageCount: 0})
    }).not.toThrowError();
    expect(pageHistory!.value.date).toEqual(date);
  });

  it('pageCountに0未満の数値もしくはNumber以外の型を指定した場合にエラーが発生すること', () => {
    expect(() => new PageHistory({id: crypto.randomUUID(), date: new Date(), pageCount: -1} as unknown as pageHistory)).toThrowError(ValidationError);
  });

  it('equals()でValueObject同士の値を比較できること', () => {
    const pageHistoryA = data.map(item => new PageHistory(item));
    const pageHistoryB = data.map(item => new PageHistory(item));

    const data2 = [
      {
        id: crypto.randomUUID(),
        date: new Date,
        pageCount: 100
      }
    ];
    const pageHistoryC = data2.map(item => new PageHistory(item));

    expect(pageHistoryA[0].equals(pageHistoryB[0])).toBeTruthy();
    expect(pageHistoryA[0].equals(pageHistoryC[0])).toBeFalsy();
  });
});

describe('Status', () => {
  const wish = 'wish';
  const reading = 'reading';
  const complete = 'complete';

  it('対応した型の値を渡すことでその値を持ったValueObjectを生成できること', () => {
    const statusWish = new Status(wish);
    const statusReading = new Status(reading);
    const statusComplete = new Status(complete);

    expect(statusWish).not.toBeUndefined();
    expect(statusWish.value).toEqual(wish);
    expect(statusReading).not.toBeUndefined();
    expect(statusReading.value).toEqual(reading);
    expect(statusComplete).not.toBeUndefined();
    expect(statusComplete.value).toEqual(complete);
  });

  it('Falthyな値もしくはstring以外の値を渡した際にエラーが発生すること', () => {
    expect(() => new Status('' as status)).toThrowError(ValidationError);
    expect(() => new Status('status' as status)).toThrowError(ValidationError);
  });

  it('equals()でValueObject同士の値を比較できること', () => {
    const statusWish1 = new Status(wish);
    const statusWish2 = new Status(wish);
    const statusReading = new Status(reading);

    expect(statusWish1.equals(statusWish2)).toBeTruthy();
    expect(statusWish1.equals(statusReading)).toBeFalsy();
  });

});

describe('UserId', () => {
  const data = 'ユーザID';

  it('対応した型の値を渡すことでその値を持ったValueObjectを生成できること', () => {
    const userId = new UserId(data);

    expect(userId).not.toBeUndefined();
    expect(userId.value).toEqual(data);
  });

  it('Falthyな値もしくはstring以外の値を渡した際にエラーが発生すること', () => {
    expect(() => new UserId('')).toThrowError(ValidationError);
    expect(() => new UserId(10 as unknown as string)).toThrowError(ValidationError);
  });

  it('equals()でUserIdのvalueと引数の値が同一かを判定できること', () => {
    const userIdA = new UserId(data);
    const userIdB = new UserId(data);
    const userIdC = new UserId('test');

    expect(userIdA.equals(userIdB)).toBeTruthy();
    expect(userIdA.equals(userIdC)).toBeFalsy();
  });
});
