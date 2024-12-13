import {
	convertDBModelToBookInfo,
	type BookInfo
} from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import type { id } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Id';
import {
	PageHistory,
	type pageHistory
} from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Feature/Contents/Domain/ValueObjects/BookInfo/Status';
import { APIRouteURLs } from '$lib/client/Shared/Constants/urls';
import { createUrlWithParams } from '$lib/client/Shared/Helpers/Urls';
import type { FetchInterface } from '$lib/client/Shared/interface';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Shared/Utils/PageHistory';
import type { BookInfoDBModel } from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';
import type { OrderFilters } from '$lib/client/Feature/Contents/interface';

export const getBookInfoById = async (fetch: FetchInterface, id: id) => {
	const response = await fetch(`${APIRouteURLs.bookInfo.route}/${id}`);
	const model = (await response.json()) as BookInfoDBModel;

	return model ? convertDBModelToBookInfo(model) : undefined;
};

export const getBookInfos = async (
	fetch: FetchInterface,
	page: number,
	options?: { status?: status; query?: string; order?: OrderFilters }
) => {
	const param = {
		page: page.toString(),
		status: options?.status ?? '',
		query: options?.query ?? '',
		order: options?.order ?? ''
	};

	const response = await fetch(createUrlWithParams(getAPIRouteByStatus(options?.status), param));
	const { totalCount, lastPageCount, bookInfoDBModels } = await parseListResponse(response);
	const bookInfos = bookInfoDBModels.map((item) => convertDBModelToBookInfo(item));

	return { totalCount, lastPageCount, bookInfos };
};

export const getRecentBookInfo = async (fetch: FetchInterface): Promise<BookInfo | undefined> => {
	const response = await fetch(APIRouteURLs.bookInfo.recent);
	const model = (await response.json()) as BookInfoDBModel;

	return model ? convertDBModelToBookInfo(model) : undefined;
};

export const getHistory = async (
	fetch: FetchInterface
): Promise<Map<string, number> | undefined> => {
	const response = await fetch(APIRouteURLs.bookInfo.history);
	const pageHistory = (await response.json()) as Array<pageHistory[]>;
	const ValueObjects = pageHistory.map((item) =>
		item.map((pageHistory) => new PageHistory(pageHistory))
	);

	return getPageHistoryMapInCurrentWeek(ValueObjects);
};

const getAPIRouteByStatus = (status?: status) => {
	if (!status) {
		return APIRouteURLs.bookInfo.route;
	}

	switch (status) {
		case 'wish':
			return APIRouteURLs.bookInfo.wish;
		case 'reading':
			return APIRouteURLs.bookInfo.reading;
		case 'complete':
			return APIRouteURLs.bookInfo.complete;
	}
};

const parseListResponse = async (response: Response) =>
	(await response.json()) as {
		totalCount: number;
		lastPageCount: number;
		bookInfoDBModels: BookInfoDBModel[];
	};
