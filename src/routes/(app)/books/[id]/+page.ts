import { getBookInfoById } from '$lib/client/Feature/Contents/DataManage/fetcher';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
	const bookInfo = await getBookInfoById(fetch, params.id);
	if (!bookInfo) {
		error(404, { message: '書誌データが見つかりませんでした。' });
	}

	return { bookInfo };
}) satisfies PageLoad;
