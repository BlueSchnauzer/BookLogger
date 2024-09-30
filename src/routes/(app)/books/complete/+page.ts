import { getBookInfosByStatus } from '$lib/client/Feature/Contents/DataManage/fetcher';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const bookInfos = await getBookInfosByStatus(fetch, 'complete');

	return { bookInfos };
}) satisfies PageLoad;
