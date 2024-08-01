import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch }) => {
	//条件を絞らず書誌データを取得
	const response = await fetch('/api/bookinfo');
	if (!response.ok) {
		throw error(response.status);
	}

	let bookInfos: BookInfo[] = await response.json();

	return { bookInfos };
}) satisfies PageServerLoad;
