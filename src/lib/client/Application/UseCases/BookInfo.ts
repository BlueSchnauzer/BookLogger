import type {
	bookInfoChangeResponse,
	BookInfoResponseItem,
	BookInfoUseCaseResult
} from '$lib/client/Application/Interface';
import {
	convertDBModelToBookInfo,
	type BookInfo
} from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
import type { Id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import {
	PageHistory,
	type pageHistory
} from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Shared/Utils/PageHistory';
import type { BookInfoDBModel } from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';
import { bookInfoView } from '$lib/client/Application/Views/BookInfo';

const requestUrl = '/api/bookinfo';
interface fetchInterface {
	(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response>;
}

export const getBookInfoUseCase = (fetch: fetchInterface) => {
	const get = async (): Promise<BookInfoUseCaseResult> => {
		const response = await fetch(requestUrl);
		return convertResponseToUseCaseResult(response);
	};

	return { get };
};

export const getWishBookInfoUseCase = (fetch: fetchInterface) => {
	const get = async (): Promise<BookInfoUseCaseResult> => {
		const response = await fetchByStatus(fetch, 'wish');
		return convertResponseToUseCaseResult(response);
	};
	return { get };
};

export const getReadingBookInfoUseCase = (fetch: fetchInterface) => {
	const get = async (): Promise<BookInfoUseCaseResult> => {
		const response = await fetchByStatus(fetch, 'reading');
		return convertResponseToUseCaseResult(response);
	};
	return { get };
};

export const getCompleteBookInfoUseCase = (fetch: fetchInterface) => {
	const get = async (): Promise<BookInfoUseCaseResult> => {
		const response = await fetchByStatus(fetch, 'complete');
		return convertResponseToUseCaseResult(response);
	};

	return { get };
};

export const getHomeBookInfoUseCases = (fetch: fetchInterface) => {
	const getRecent = async (): Promise<BookInfoResponseItem | undefined> => {
		const response = await fetch(`${requestUrl}?type=recent`);
		const model = (await response.json()) as BookInfoDBModel;
		if (!model) {
			return undefined;
		}

		const entity = convertDBModelToBookInfo(model);
		const view = bookInfoView(entity);

		return { entity, view };
	};

	const getHistory = async (): Promise<Map<string, number> | undefined> => {
		const response = await fetch(`${requestUrl}/history`);
		const pageHistory = (await response.json()) as Array<pageHistory[]>;
		const ValueObjects = pageHistory.map((item) =>
			item.map((pageHistory) => new PageHistory(pageHistory))
		);

		return getPageHistoryMapInCurrentWeek(ValueObjects);
	};

	return { getRecent, getHistory };
};

export const createBookInfoUseCase = (fetch: fetchInterface) => {
	const create = async (bookSearch: BookSearch): Promise<bookInfoChangeResponse> => {
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

	return { create };
};

export const registeredBookInfoUseCases = (fetch: fetchInterface) => {
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
			body: JSON.stringify(id.value),
			headers: { 'Content-type': 'application/json' }
		});

		const message = isSuccess
			? '削除しました'
			: '削除に失敗しました。<br>時間をおいて再度登録してください。';
		return { isSuccess, message };
	};

	return { update, remove };
};

const fetchByStatus = async (fetch: fetchInterface, status: status): Promise<Response> => {
	//eg. '/api/bookinfo?type=wish'
	return await fetch(`${requestUrl}?type=${status}`);
};

const convertResponseToUseCaseResult = async (response: Response) => {
	const models = (await response.json()) as BookInfoDBModel[];
	const result = models.map((item) => {
		const entity = convertDBModelToBookInfo(item);
		const view = bookInfoView(entity);
		return { entity, view };
	});

	return { items: result };
};
