import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";

/**読んだ記録を保持する */
export class PageHistory extends ValueObjectsBase<pageHistory> {
  constructor(pageHistory: pageHistory) {
    super(pageHistory);
  }

  protected validate(value: pageHistory): void {
    if (!value || (!value.id || !value.date || !value.pageCount)) { throw new ValidationError('PageHistoryの値が設定されていません'); }
    if (typeof value.id !== 'string' || !(value.date instanceof Date) || typeof value.pageCount !== 'number' ) { throw new ValidationError('PageHistoryの型が不正です'); }
  }

  protected equalsCore(vo: ValueObjectsBase<pageHistory>): boolean {
    return this.value.id === vo.value.id && this.value.date === vo.value.date && this.value.pageCount === vo.value.pageCount;
  }
}

export type pageHistory = {
  id: string,
  date: Date,
  pageCount: number
}