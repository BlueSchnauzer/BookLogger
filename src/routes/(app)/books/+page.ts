import { getBookInfos } from '$lib/client/Feature/Contents/DataManage/fetcher';
import { getContentsSearchConditions } from '$lib/client/Shared/Helpers/Urls';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const { pageCount, query, order } = getContentsSearchConditions(url.searchParams);

	const { totalCount, lastPageCount, bookInfos } = await getBookInfos(fetch, pageCount, {
		query,
		order
	});

	return { pageCount, query, order, totalCount, lastPageCount, bookInfos };
}) satisfies PageLoad;
