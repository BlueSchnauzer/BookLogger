import { ValueObjectsBase } from "$lib/server/Domain/ValueObjects/ValueObjectBase";
import { ValidationError } from "$lib/server/Domain/Exceptions/ValidationError";

/**読んだ記録を保持する */
export class PageHistory extends ValueObjectsBase<pageHistory> {
  constructor(pageHistory: pageHistory) {
    super(pageHistory);
  }

  protected validate(value: pageHistory): void {
    if (!value || (!value.id || !value.date || value.pageCount < 0 )) { throw new ValidationError('PageHistoryの値が設定されていません'); }
    if (typeof value.id !== 'string' || !this.validateDate(value.date) || typeof value.pageCount !== 'number' ) { throw new ValidationError('PageHistoryの型が不正です'); }
  }

  protected equalsCore(vo: ValueObjectsBase<pageHistory>): boolean {
    return this.value.id === vo.value.id && this.value.date === vo.value.date && this.value.pageCount === vo.value.pageCount;
  }

  private validateDate(date: Date | string): boolean {
    if (date instanceof Date) {
      return true;
    }
    else if (typeof date === 'string') {
      const convertedDate = new Date(date);
      if (!isNaN(convertedDate.getTime())) { return true; }
    }

    return false;
  };

  protected convertValue(value: pageHistory): pageHistory {
    if (typeof value.date === 'string') { value.date = new Date(value.date); }
    
    return value;
  }
}

export type pageHistory = {
  id: string,
  date: Date | string,
  pageCount: number
}

/**pageHistoryのみをMongoDBから取得する際のtype */
export type pageHistoryArray = Array<{pageHistories: pageHistory[]}>;