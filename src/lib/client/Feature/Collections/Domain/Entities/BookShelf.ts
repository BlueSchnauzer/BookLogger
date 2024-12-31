import type { Id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import type { UserId } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/UserId';

export interface BookShelf {
	id?: Id;
	userId: UserId;
	shelfName: string;
	contentsIds: Id[];
	createDate: Date;
	updateDate: Date;
}
