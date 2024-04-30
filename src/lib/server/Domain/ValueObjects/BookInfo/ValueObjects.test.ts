import { describe, expect, it } from "vitest";
import { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import { Identifiers } from "$lib/server/Domain/ValueObjects/BookInfo/Identifier";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";
import { PageHistory, type pageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";

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

  it('pageCountに0以上の数値もしくはNumber以外の型を指定した場合にエラーが発生すること', () => {
    expect(() => new PageHistory({id: crypto.randomUUID(), date: new Date(), pageCount: 0} as unknown as pageHistory)).toThrowError(ValidationError);
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