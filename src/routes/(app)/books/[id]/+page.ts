import { getBookInfoById } from '$lib/client/Feature/Contents/DataManage/fetcher';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const bookInfo = await getBookInfoById(fetch, params.id);

	return { bookInfo };
}) satisfies PageLoad;
