import type { RequestHandler } from '../../bookinfo/$types';
import collections from '$lib/server/Feature/Contents/MongoDB/MongoDBHelper';
import { BookInfoMongoDBResource } from '$lib/server/Feature/Contents/MongoDB/BookInfoDBResource';
import { json } from '@sveltejs/kit';
import { verifyTokenAndCollections } from '../../verification';

interface SlugParams {
	id: string;
}

export const GET: RequestHandler = async ({ cookies, params }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const { id } = params as SlugParams;

	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);
	const mongoDBModel = await repos.getBookInfo(id);

	return json(mongoDBModel ? mongoDBModel : null, { status: 200 });
};
