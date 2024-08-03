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

export interface bookInfoReactiveEvent<T> {
	success: T;
	failed: string;
}

export interface updateBookInfoParameter {
	message: string;
	updatedItem: BookInfoView;
}

export interface deletionBookInfoParameter {
	message: string;
	deletedId: Id;
}

export const dispatchUpdateBookInfoRequest = (
	dispatch: EventDispatcher<bookInfoReactiveEvent<updateBookInfoParameter>>,
	isSuccess: boolean,
	message: string,
	updatedItem: BookInfoView
) => {
	if (isSuccess) {
		dispatch('success', { message, updatedItem });
	} else {
		dispatch('failed', message);
	}
};

export const dispatchDeletionBookInfoRequest = (
	dispatch: EventDispatcher<bookInfoReactiveEvent<deletionBookInfoParameter>>,
	isSuccess: boolean,
	message: string,
	deletedId: Id
) => {
	if (isSuccess) {
		dispatch('success', { message, deletedId });
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
