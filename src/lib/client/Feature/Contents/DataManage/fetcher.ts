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

export const getBookInfoById = async (fetch: FetchInterface, id: id) => {
	const response = await fetch(`${APIRouteURLs.bookInfo}/${id}`);
	const model = (await response.json()) as BookInfoDBModel;

	return model ? convertDBModelToBookInfo(model) : undefined;
};

export const getBookInfos = async (fetch: FetchInterface, page: number) => {
	const param = { page: page.toString() };

	const response = await fetch(createUrlWithParams(APIRouteURLs.bookInfo, param));
	const { totalCount, maxPageCount, bookInfoDBModels } = await parseListResponse(response);
	const bookInfos = bookInfoDBModels.map((item) => convertDBModelToBookInfo(item));

	return { totalCount, maxPageCount, bookInfos };
};

export const getBookInfosByStatus = async (fetch: FetchInterface, page: number, status: status) => {
	const params = { page: page.toString(), type: status };

	const response = await fetch(createUrlWithParams(APIRouteURLs.bookInfo, params));
	const { totalCount, maxPageCount, bookInfoDBModels } = await parseListResponse(response);
	const bookInfos = bookInfoDBModels.map((item) => convertDBModelToBookInfo(item));

	return { totalCount, maxPageCount, bookInfos };
};

export const getRecentBookInfo = async (fetch: FetchInterface): Promise<BookInfo | undefined> => {
	const param = { type: 'recent' };

	const response = await fetch(createUrlWithParams(APIRouteURLs.bookInfo, param));
	const model = (await response.json()) as BookInfoDBModel;

	return model ? convertDBModelToBookInfo(model) : undefined;
};

export const getHistory = async (
	fetch: FetchInterface
): Promise<Map<string, number> | undefined> => {
	const response = await fetch(`${APIRouteURLs.bookInfo}/history`);
	const pageHistory = (await response.json()) as Array<pageHistory[]>;
	const ValueObjects = pageHistory.map((item) =>
		item.map((pageHistory) => new PageHistory(pageHistory))
	);

	return getPageHistoryMapInCurrentWeek(ValueObjects);
};

const parseListResponse = async (response: Response) =>
	(await response.json()) as {
		totalCount: number;
		maxPageCount: number;
		bookInfoDBModels: BookInfoDBModel[];
	};
