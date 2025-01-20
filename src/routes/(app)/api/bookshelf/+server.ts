import { type BookShelf } from '$lib/client/Feature/Collections/Domain/Entities/BookShelf';
import { getCollectionsSearchConditions } from '$lib/client/Shared/Helpers/Urls';
import { BookShelfMongoDBResource } from '$lib/server/Feature/Collections/MongoDB/BookShelfDBResource';
import { convertBookShelfToDBModel } from '$lib/server/Feature/Collections/MongoDB/BookShelfModel';
import collections from '$lib/server/Shared/Helpers/MongoDBHelper';
import { json } from '@sveltejs/kit';
import { verifyTokenAndCollections } from '../verification';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const repos = new BookShelfMongoDBResource(collections?.bookShelves!, userId!);
	const { query, order } = getCollectionsSearchConditions(url.searchParams);

	const bookShelves = await repos.getBookShelves({ query, order });
	return json(bookShelves, { status: 200 });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const bookShelf = (await request.json()) as BookShelf;
	const repos = new BookShelfMongoDBResource(collections?.bookShelves!, userId!);
	return await repos.insert(convertBookShelfToDBModel(bookShelf));
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const bookShelf = (await request.json()) as BookShelf;
	const repos = new BookShelfMongoDBResource(collections?.bookShelves!, userId!);
	return await repos.update(convertBookShelfToDBModel(bookShelf));
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const id: string = await request.json();
	if (!id) {
		return new Response('データが不正です', { status: 400 });
	}

	const repos = new BookShelfMongoDBResource(collections?.bookShelves!, userId!);
	return await repos.delete(id);
};
