import type { bookInfoChangeResponse } from '$lib/client/Application/Interface';
import { convertDBModelToBookInfo, type BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { BookInfoDBModel } from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';
import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import {
	PageHistory,
	type pageHistory
} from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Utils/PageHistory';
import type {
	BookSearch,
	BookSearchResultListType,
	BookSearchResultType
} from '$lib/client/Domain/Entities/BookSearch';

const requestUrl = '/api/bookinfoDDD';

export const bookInfoUseCase = <ResultType extends BookSearchResultType<BookSearchResultListType>>(
	fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>
) => {
	const get = async (): Promise<BookInfo[]> => {
		const response = await fetch(requestUrl);
		const models = (await response.json()) as BookInfoDBModel[];

		return models.map((item) => convertDBModelToBookInfo(item));
	};

	const getWish = async (): Promise<BookInfo[]> => {
		const response = await fetchByStatus(fetch, 'wish');
		const models = (await response.json()) as BookInfoDBModel[];

		return models.map((item) => convertDBModelToBookInfo(item));
	};

	const getReading = async (): Promise<BookInfo[]> => {
		const response = await fetchByStatus(fetch, 'reading');
		const models = (await response.json()) as BookInfoDBModel[];

		return models.map((item) => convertDBModelToBookInfo(item));
	};

	const getComplete = async (): Promise<BookInfo[]> => {
		const response = await fetchByStatus(fetch, 'complete');
		const models = (await response.json()) as BookInfoDBModel[];

		return models.map((item) => convertDBModelToBookInfo(item));
	};

	const getRecent = async (): Promise<BookInfo | undefined> => {
		const response = await fetch(`${requestUrl}?type=recent`);
		const model = (await response.json()) as BookInfoDBModel;

		return convertDBModelToBookInfo(model);
	};

	const getHistory = async (): Promise<Map<string, number> | undefined> => {
		const response = await fetch(`${requestUrl}/history`);
		const pageHistory = (await response.json()) as Array<pageHistory[]>;
		const ValueObjects = pageHistory.map((item) =>
			item.map((pageHistory) => new PageHistory(pageHistory))
		);

		return getPageHistoryMapInCurrentWeek(ValueObjects);
	};

	const create = async (bookSearch: BookSearch): Promise<bookInfoChangeResponse> => {
		console.log('create book search', bookSearch);
		const { ok: isSuccess, status } = await fetch(requestUrl, {
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

	const update = async (
		bookInfo: BookInfo,
		beforeStatus: status
	): Promise<bookInfoChangeResponse> => {
		const isCompleteReading = beforeStatus !== 'complete' && bookInfo.status.value === 'complete';

		const { ok: isSuccess } = await fetch(requestUrl, {
			method: 'PUT',
			body: JSON.stringify({ bookInfo, isCompleteReading }),
			headers: { 'Content-type': 'application/json' }
		});

		const message = isSuccess
			? '更新しました。'
			: '更新に失敗しました。<br>時間をおいてから再度お試しください。';
		return { isSuccess, message };
	};

	const remove = async (id: Id): Promise<bookInfoChangeResponse> => {
		const { ok: isSuccess } = await fetch(requestUrl, {
			method: 'DELETE',
			body: JSON.stringify(id),
			headers: { 'Content-type': 'application/json' }
		});

		const message = isSuccess
			? '削除しました'
			: '削除に失敗しました。<br>時間をおいて再度登録してください。';
		return { isSuccess, message };
	};

	return {
		get,
		getWish,
		getReading,
		getComplete,
		getRecent,
		getHistory,
		create,
		update,
		remove
	};
};

const fetchByStatus = async (
	fetch: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>,
	status: status
): Promise<Response> => {
	//eg. '/api/bookinfo?type=wish'
	return await fetch(`${requestUrl}?type=${status}`);
};
