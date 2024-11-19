import { getBookInfos } from '$lib/client/Feature/Contents/DataManage/fetcher';
import { getPageCount } from '$lib/client/Shared/Helpers/Urls';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const pageCount = getPageCount(url.searchParams);
	const { totalCount, maxPageCount, bookInfos } = await getBookInfos(fetch, pageCount);

	return { pageCount, totalCount, maxPageCount, bookInfos };
}) satisfies PageLoad;
