import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";

export class UserId extends ValueObjectsBase<string> {
  constructor(public value: string) {
    super(value);
  }
  
  validate(value: string): void {
    if (!value) { throw new ValidationError('UserIdが設定されていません'); }
    if (typeof value !== 'string') { throw new ValidationError('UserIdの形式が文字列ではありません'); }
  }

  equalsCore(vo: ValueObjectsBase<string>): boolean {
    return this.value === vo.value;
  }
}