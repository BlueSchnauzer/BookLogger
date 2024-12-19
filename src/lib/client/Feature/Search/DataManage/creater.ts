import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
import { APIRouteURLs } from '$lib/client/Shared/Constants/urls';
import type { FetchInterface } from '$lib/client/Shared/interface';

export const createBookInfo = async (fetch: FetchInterface, bookSearch: BookSearch) => {
	const { ok: isSuccess, status } = await fetch(APIRouteURLs.bookInfo.route, {
		method: 'POST',
		body: JSON.stringify(bookSearch),
		headers: { 'Content-type': 'application/json' }
	});

	const message = isSuccess
		? '登録しました'
		: status === 409
			? '登録済みの書籍です'
			: '登録に失敗しました。<br>時間をおいて再度登録してください。';

	return { isSuccess, message };
};
