import { describe, expect, it } from "vitest";
import { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";

describe('UserId', () => {
  const data = 'ユーザID';

  it('stringの値を渡すことでその値を持ったUserIdを生成できること', () => {
    const userId = new UserId(data);

    expect(userId).not.toBeUndefined();
    expect(userId.value).toEqual(data);
  });

  it('Falthyな値もしくはstring以外の値を渡した際にエラーが発生すること', () => {
    expect(new UserId('')).toThrowError(Error);
    expect(new UserId(10 as unknown as string)).toThrowError(Error);
  });

  it('equals()でUserIdのvalueと引数の値が同一かを判定できること', () => {
    const userIdA = new UserId(data);
    const userIdB = new UserId(data);
    const userIdC = new UserId('test');

    expect(userIdA.equals(userIdB)).toBeTruthy();
    expect(userIdA.equals(userIdC)).toBeFalsy();
  });
});