import type { RequestHandler } from '../../bookinfo/$types';
import { verifyTokenAndCollections } from '../../verification';
import collections from '$lib/server/Feature/Contents/MongoDB/MongoDBHelper';
import { BookInfoMongoDBResource } from '$lib/server/Feature/Contents/MongoDB/BookInfoDBResource';
import { json } from '@sveltejs/kit';
import { getContentsSearchConditions } from '$lib/client/Shared/Helpers/Urls';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);
	const { pageCount, query, order } = getContentsSearchConditions(url.searchParams);

	const bookInfos = await repos.getBookInfos(pageCount, { status: 'wish', query, order });
	return json(bookInfos, { status: 200 });
};
