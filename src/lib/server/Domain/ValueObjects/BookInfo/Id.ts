import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";
import type { ObjectId } from "mongodb";

//一旦、StringとObjectID。あまり複数の型を指定できるのは良くない？

export class Id extends ValueObjectsBase<id> {
  constructor(public value: id) {
    super(value);
  }
  
  validate(value: id): void {
    if (!value) { throw new ValidationError('Idが設定されていません'); }
    
    //ObjectIdの判定方法が分からないので保留
    // if (typeof value !== 'string' || value instanceof ObjectId) { throw new ValidationError('Idの形式が文字列またはObjectIdではありません'); }
  }

  equalsCore(vo: ValueObjectsBase<id>): boolean {
    return this.value === vo.value;
  }
}

export type id = string | ObjectId;