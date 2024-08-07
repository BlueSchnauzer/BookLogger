import type { BookSearchResponseItem } from '$lib/client/Application/Interface';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { BookSearch } from '$lib/client/Domain/Entities/BookSearch';
import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { EventDispatcher } from 'svelte';

export interface bookInfoClickEvent {
	click: BookInfo;
}

export const dispatchBookInfoClick = (
	dispatch: EventDispatcher<bookInfoClickEvent>,
	entity: BookInfo
) => {
	dispatch('click', entity);
};

export interface bookInfoUpdateEvent {
	updateSuccess: updateBookInfoParameter;
	failed: string;
}

export interface updateBookInfoParameter {
	message: string;
	updatedItem: BookInfo;
}

export interface bookInfoDeleteEvent {
	deleteSuccess: deletionBookInfoParameter;
	failed: string;
}

export interface deletionBookInfoParameter {
	message: string;
	deletedId: Id;
}

export const dispatchUpdateBookInfoRequest = (
	dispatch: EventDispatcher<bookInfoUpdateEvent>,
	isSuccess: boolean,
	message: string,
	updatedItem: BookInfo
) => {
	if (isSuccess) {
		dispatch('updateSuccess', { message, updatedItem });
	} else {
		dispatch('failed', message);
	}
};

export const dispatchDeletionBookInfoRequest = (
	dispatch: EventDispatcher<bookInfoDeleteEvent>,
	isSuccess: boolean,
	message: string,
	deletedId: Id
) => {
	if (isSuccess) {
		dispatch('deleteSuccess', { message, deletedId });
	} else {
		dispatch('failed', message);
	}
};

export interface bookSearchClickEvent {
	click: BookSearchResponseItem;
}

export const dispatchBookSearchClick = (
	dispatch: EventDispatcher<bookSearchClickEvent>,
	response: BookSearchResponseItem
) => {
	dispatch('click', response);
};

export interface bookSearchSaveEvent {
	success: string;
	failed: string;
}

export const dispatchSaveBookSearchRequest = (
	dispatch: EventDispatcher<bookSearchSaveEvent>,
	isSuccess: boolean,
	message: string
) => {
	if (isSuccess) {
		dispatch('success', message);
	} else {
		dispatch('failed', message);
	}
};
