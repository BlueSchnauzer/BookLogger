import { convertDBModelToBookInfo, type BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { BookInfoDBModel } from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';
import {
	PageHistory,
	type pageHistory
} from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Utils/PageHistory';
import { bookInfoAPIRoute } from '$lib/client/Shared/Constants/requestUrls';
import type { FetchInterface } from '$lib/client/Shared/interface';

export const getBookInfos = async (fetch: FetchInterface): Promise<BookInfo[]> => {
	const response = await fetch(bookInfoAPIRoute);
	const models = (await response.json()) as BookInfoDBModel[];

	return models.map((item) => convertDBModelToBookInfo(item));
};

export const getBookInfosByStatus = async (
	fetch: FetchInterface,
	status: status
): Promise<BookInfo[]> => {
	const response = await fetch(`${bookInfoAPIRoute}?type=${status}`);
	const models = (await response.json()) as BookInfoDBModel[];

	return models.map((item) => convertDBModelToBookInfo(item));
};

export const getRecentBookInfo = async (fetch: FetchInterface): Promise<BookInfo | undefined> => {
	const response = await fetch(`${bookInfoAPIRoute}?type=recent`);
	const model = (await response.json()) as BookInfoDBModel;

	if (!model) {
		return undefined;
	}

	return convertDBModelToBookInfo(model);
};

export const getHistory = async (
	fetch: FetchInterface
): Promise<Map<string, number> | undefined> => {
	const response = await fetch(`${bookInfoAPIRoute}/history`);
	const pageHistory = (await response.json()) as Array<pageHistory[]>;
	const ValueObjects = pageHistory.map((item) =>
		item.map((pageHistory) => new PageHistory(pageHistory))
	);

	return getPageHistoryMapInCurrentWeek(ValueObjects);
};
