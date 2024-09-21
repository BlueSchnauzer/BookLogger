import { getBookInfos } from '$lib/client/Feature/Contents/DataManage/fetcher';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const bookInfos = await getBookInfos(fetch);

	return { bookInfos };
}) satisfies PageLoad;
