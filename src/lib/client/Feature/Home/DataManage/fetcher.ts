import { type BookInfo, convertDBModelToBookInfo } from '$lib/client/Domain/Entities/BookInfo';
import {
	PageHistory,
	type pageHistory
} from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import { bookInfoAPIRoute } from '$lib/client/Shared/Constants/requestUrls';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Utils/PageHistory';
import type { BookInfoDBModel } from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';
import type { FetchInterface } from '$lib/client/Shared/interface';

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
