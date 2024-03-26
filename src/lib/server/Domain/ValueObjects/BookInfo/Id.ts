import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";
import type { ObjectId } from "mongodb";

//一旦、StringとObjectID。あまり複数の型を指定できるのは良くない？

export class Id extends ValueObjectsBase<string | ObjectId> {
  constructor(public value: string | ObjectId) {
    super(value);
  }
  
  validate(value: string | ObjectId): void {
    if (!value) { throw new ValidationError('Idが設定されていません'); }
    if (typeof value !== 'string') { throw new ValidationError('Idの形式が文字列またはObjectIdではありません'); }
  }

  equalsCore(vo: ValueObjectsBase<string | ObjectId>): boolean {
    return this.value === vo.value;
  }
}