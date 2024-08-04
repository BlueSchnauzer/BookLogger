import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { Identifiers } from '$lib/client/Domain/ValueObjects/BookInfo/Identifier';
import { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { Status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import type { ObjectId } from 'mongodb';

export interface BookInfo {
	id?: Id;
	userId: UserId;
	title: string;
	author: string[];
	thumbnail: string;
	createDate: Date;
	updateDate: Date;
	pageCount: number;
	isFavorite: boolean;
	status: Status;
	memorandum: string;
	isVisible: boolean;
	completeDate?: Date;
	pageHistories?: PageHistory[];
	identifiers?: Identifiers;
	shelfCategories?: ObjectId[];
	gapiId?: string;
}
