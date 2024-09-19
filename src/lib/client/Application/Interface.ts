import type { bookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';

export interface BookInfoResponseItem {
	entity: BookInfo;
	view: ReturnType<typeof bookInfoView>;
}

export interface BookInfoUseCaseResult {
	items: BookInfoResponseItem[] | undefined;
}

export interface bookInfoChangeResponse {
	isSuccess: boolean;
	message: string;
}
