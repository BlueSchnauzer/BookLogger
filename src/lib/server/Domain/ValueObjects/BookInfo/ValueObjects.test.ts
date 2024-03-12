import { describe, expect, it } from "vitest";
import { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";

describe('UserId', () => {
  const data = 'ユーザID';

  it('stringの値を渡すことでその値を持ったUserIdを生成できること', () => {
    const userId = new UserId(data);

    expect(userId).not.toBeUndefined();
    expect(userId.value).toEqual(data);
  });
});