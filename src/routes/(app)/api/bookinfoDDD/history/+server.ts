import type { RequestHandler } from '../../bookinfo/$types';
import { verifyAndCreateUserId } from '$lib/server/Helpers/SvelteAPI';
import collections from '$lib/server/database/collections';
import { json } from '@sveltejs/kit';
import { BookInfoMongoDBResource } from '$lib/server/Infrastructure/MongoDB/BookInfoDBResource';

export const GET: RequestHandler = async ({ cookies }) => {
	const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
	if (!userId) {
		return new Response('ログイン情報が不正です', { status: 400 });
	}
	if (!collections) {
		return new Response('サーバーエラー', { status: 500 });
	}

	const response = await new BookInfoMongoDBResource(
		collections.bookInfos!,
		userId
	).getPageHistory();

	return json(response, { status: 200 });
};
