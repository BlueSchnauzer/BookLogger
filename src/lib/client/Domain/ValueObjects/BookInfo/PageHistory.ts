import { ValueObjectsBase } from '$lib/client/Domain/ValueObjects/ValueObjectBase';
import { ValidationError } from '$lib/client/Domain/Exceptions/ValidationError';

/**読んだ記録を保持する */
export class PageHistory extends ValueObjectsBase<pageHistory> {
	constructor(pageHistory: pageHistory) {
		if (!pageHistory.id) {
			pageHistory.id = crypto.randomUUID();
		}
		super(pageHistory);
	}

	protected validate(value: pageHistory): void {
		if (!value || !value.id || !value.date || value.pageCount < 0) {
			throw new ValidationError('PageHistoryの値が設定されていません');
		}
		if (
			typeof value.id !== 'string' ||
			!this.validateDate(value.date) ||
			typeof value.pageCount !== 'number'
		) {
			throw new ValidationError('PageHistoryの型が不正です');
		}
	}

	protected equalsCore(vo: ValueObjectsBase<pageHistory>): boolean {
		return (
			this.value.id === vo.value.id &&
			this.value.date === vo.value.date &&
			this.value.pageCount === vo.value.pageCount
		);
	}

	private validateDate(date: Date | string): boolean {
		if (date instanceof Date) {
			return true;
		} else if (typeof date === 'string') {
			const convertedDate = new Date(date);
			if (!isNaN(convertedDate.getTime())) {
				return true;
			}
		}

		return false;
	}

	protected convertValue(value: pageHistory): pageHistory {
		if (typeof value.date === 'string') {
			value.date = new Date(value.date);
		}

		return value;
	}

	convertDateToString() {
		//DBから取った書誌データは文字列で日付を持ってるため
		//一旦、Usecaseに入っている処理を持ってきたので共通化してもいい。
		let date = new Date(this.value.date);
		return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
	}
}

export type pageHistory = {
	id?: string;
	date: Date | string;
	pageCount: number;
};
