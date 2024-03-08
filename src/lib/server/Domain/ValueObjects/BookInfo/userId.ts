import { ValueObjectsBase } from "../ValueObjectBase";

export class UserId extends ValueObjectsBase<string> {
  constructor(public value: string) {
    super(value);
  }
  
  validate(value: string): void {
    if (!value) { throw Error('UserIdが設定されていません'); }
    if (typeof value !== 'string') { throw Error('UserIdの形式が文字列ではありません'); }
  }

  equalsCore(vo: ValueObjectsBase<string>): boolean {
    return this.value === vo.value;
  }
}