import type {
	BookSearchResultListType,
	BookSearchResultType
} from '$lib/client/Application/Interface';
import type { BookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { BookSearchView } from '$lib/client/Application/Views/BookSearch';
import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { createEventDispatcher, type EventDispatcher } from 'svelte';

export interface bookInfoEvent<T> {
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
	isSuccess: boolean,
	message: string,
	updatedItem: BookInfoView
) => {
	const dispatch = createEventDispatcher<bookInfoEvent<updateBookInfoParameter>>();
	if (isSuccess) {
		dispatch('success', { message, updatedItem });
	} else {
		dispatch('failed', message);
	}
};

export const dispatchDeletionBookInfoRequest = (
	isSuccess: boolean,
	message: string,
	deletedId: Id
) => {
	const dispatch = createEventDispatcher<bookInfoEvent<deletionBookInfoParameter>>();
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
