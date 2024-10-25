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
import type { FetchInterface } from '$lib/client/Shared/interface';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Shared/Utils/PageHistory';
import type { BookInfoDBModel } from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';

export const getBookInfoById = async (fetch: FetchInterface, id: id) => {
	const response = await fetch(`${APIRouteURLs.bookInfo}/${id}`);
	const model = (await response.json()) as BookInfoDBModel;

	return model ? convertDBModelToBookInfo(model) : undefined;
};

export const getBookInfos = async (fetch: FetchInterface): Promise<BookInfo[]> => {
	const response = await fetch(APIRouteURLs.bookInfo);
	const models = (await response.json()) as BookInfoDBModel[];

	return models.map((item) => convertDBModelToBookInfo(item));
};

export const getBookInfosByStatus = async (
	fetch: FetchInterface,
	status: status
): Promise<BookInfo[]> => {
	const response = await fetch(`${APIRouteURLs.bookInfo}?type=${status}`);
	const models = (await response.json()) as BookInfoDBModel[];

	return models.map((item) => convertDBModelToBookInfo(item));
};

export const getRecentBookInfo = async (fetch: FetchInterface): Promise<BookInfo | undefined> => {
	const response = await fetch(`${APIRouteURLs.bookInfo}?type=recent`);
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
