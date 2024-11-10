import { getBookInfosByStatus } from '$lib/client/Feature/Contents/DataManage/fetcher';
import { getPageCount } from '$lib/client/Shared/Helpers/Urls';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, url }) => {
	const pageCount = getPageCount(url.searchParams);
	const { totalCount, bookInfos } = await getBookInfosByStatus(fetch, pageCount, 'complete');

	return { totalCount, bookInfos };
}) satisfies PageLoad;
