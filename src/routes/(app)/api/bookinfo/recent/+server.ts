import type { RequestHandler } from '../../bookinfo/$types';
import { verifyTokenAndCollections } from '../../verification';
import collections from '$lib/server/Feature/Contents/MongoDB/MongoDBHelper';
import { BookInfoMongoDBResource } from '$lib/server/Feature/Contents/MongoDB/BookInfoDBResource';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);

	const recentData = await repos.getRecentBookInfo();
	return json(recentData ?? null, { status: 200 });
};
