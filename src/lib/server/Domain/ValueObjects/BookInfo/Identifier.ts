import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";

/**ISBNを保持する */
export class Identifiers extends ValueObjectsBase<identifiers> {
  constructor(public readonly isbn_13?: string, public readonly isbn_10?: string) {
    super({isbn_13, isbn_10});
  }

  protected validate(value: identifiers): void {
    if (!value || (!value.isbn_13 || !value.isbn_10)) { throw new ValidationError('ISBNが設定されていません'); }
    if (typeof value.isbn_13 !== 'string' || typeof value.isbn_10 !== 'string') { throw new ValidationError('ISBNの形式が文字列ではありません'); }
  }

  protected equalsCore(vo: ValueObjectsBase<identifiers>): boolean {
    return this.isbn_13 === vo.value.isbn_13 && this.isbn_10 === vo.value.isbn_10;
  }
}

export type identifiers = {
  isbn_13?: string,
  isbn_10?: string
}