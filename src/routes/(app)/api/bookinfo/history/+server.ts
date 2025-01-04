import type { RequestHandler } from '../../bookinfo/$types';
import collections from '$lib/server/Shared/Helpers/MongoDBHelper';
import { json } from '@sveltejs/kit';
import { BookInfoMongoDBResource } from '$lib/server/Feature/Contents/MongoDB/BookInfoDBResource';
import { verifyTokenAndCollections } from '../../verification';

export const GET: RequestHandler = async ({ cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const pageHistory = await new BookInfoMongoDBResource(
		collections?.bookInfos!,
		userId!
	).getPageHistory();

	return json(pageHistory, { status: 200 });
};
