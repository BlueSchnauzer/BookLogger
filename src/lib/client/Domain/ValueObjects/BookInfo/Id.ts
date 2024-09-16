import { ValueObjectsBase } from '$lib/client/Domain/ValueObjects/ValueObjectBase';
import { ValidationError } from '$lib/client/Shared/Exceptions/ValidationError';

export class Id extends ValueObjectsBase<id> {
	constructor(public value: id) {
		super(value);
	}

	validate(value: id): void {
		if (!value) {
			throw new ValidationError('Idが設定されていません');
		}
		if (typeof value !== 'string') {
			throw new ValidationError('Idの形式が文字列ではありません');
		}
	}

	equalsCore(vo: ValueObjectsBase<id>): boolean {
		return this.value === vo.value;
	}
}

export type id = string;
