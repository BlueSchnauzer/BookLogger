import { describe, expect, it } from "vitest";
import { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import { Identifiers } from "$lib/server/Domain/ValueObjects/BookInfo/Identifier";
import { ValidationError } from "../../Exceptions/ValidationError";

describe('UserId', () => {
  const data = 'ユーザID';

  it('stringの値を渡すことでその値を持ったUserIdを生成できること', () => {
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

describe('Identifiers', () => {
  const isbn_13 = '978-4-15-120051-9';
  const isbn_10 = '4-15-031316-6';

  it('ISBNの値を渡すことでその値を持ったIdentifiersを生成できること', () => {
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

  // it('equals()でUserIdのvalueと引数の値が同一かを判定できること', () => {
  //   const userIdA = new Identifiers(data);
  //   const userIdB = new Identifiers(data);
  //   const userIdC = new Identifiers('test');

  //   expect(userIdA.equals(userIdB)).toBeTruthy();
  //   expect(userIdA.equals(userIdC)).toBeFalsy();
  // });
});