import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";

export class Status extends ValueObjectsBase<status> {
  constructor(public value: status) {
    super(value);
  }
  
  protected validate(value: status): void {
    if (!value) { throw new ValidationError('Statusが設定されていません'); }
    if (typeof value !== 'string') { throw new ValidationError('Statusの形式が文字列ではありません'); }
    if (value !== 'wish' && value !== 'reading' && value !== 'complete') { throw new ValidationError('Statusはwish、readingまたはcompleteである必要があります'); }
  }
  
  protected equalsCore(vo: ValueObjectsBase<status>): boolean {
    return this.value === vo.value;
  }
}

/**書誌データのステータス */
export type status = 'wish' | 'reading' | 'complete';
