import type {
	BookSearchResultListType,
	BookSearchResultType
} from '$lib/client/Application/Interface';
import type { BookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { BookSearchView } from '$lib/client/Application/Views/BookSearch';
import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { EventDispatcher } from 'svelte';

export interface bookInfoClickEvent {
	click: BookInfoView;
}

export const dispatchBookInfoViewClick = (
	dispatch: EventDispatcher<bookInfoClickEvent>,
	view: BookInfoView
) => {
	dispatch('click', view);
};

export interface bookInfoUpdateEvent {
	updateSuccess: updateBookInfoParameter;
	failed: string;
}

export interface updateBookInfoParameter {
	message: string;
	updatedItem: BookInfoView;
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
	updatedItem: BookInfoView
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
	click: BookSearchView<BookSearchResultType<BookSearchResultListType>>;
}

export const dispatchBookSearchViewClick = (
	dispatch: EventDispatcher<bookSearchClickEvent>,
	view: BookSearchView<BookSearchResultType<BookSearchResultListType>>
) => {
	dispatch('click', view);
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
