import { getBookInfos } from '$lib/client/Feature/Contents/DataManage/fetcher';
import { getContentsSearchConditions } from '$lib/client/Shared/Helpers/Urls';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const { page, query, order } = getContentsSearchConditions(url.searchParams);

	const { totalCount, lastPageCount, bookInfos } = await getBookInfos(fetch, page, {
		query,
		order
	});

	return { page, totalCount, lastPageCount, bookInfos };
}) satisfies PageLoad;
