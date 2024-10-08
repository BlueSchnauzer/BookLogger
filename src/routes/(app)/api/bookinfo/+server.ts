import type { BookInfo } from '$lib/client/Feature/Contents/Domain/Entities/BookInfo';
import type { BookSearch } from '$lib/client/Feature/Search/BookSearch';
import { validatePutBookInfo } from '$lib/client/Shared/Utils/Validation';
import collections from '$lib/server/Feature/Contents/MongoDB/MongoDBHelper';
import {
	convertBookInfoToDBModel,
	convertBookSearchToDBModel,
	type BookInfoDBModel
} from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';
import { verifyAndCreateUserId } from '$lib/server/Feature/Auth/idManager';
import { BookInfoMongoDBResource } from '$lib/server/Feature/Contents/MongoDB/BookInfoDBResource';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { verifyTokenAndCollections } from '../verification';

/**書誌データを取得する
 * クエリパラメータに応じて返却するデータを変更する。
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);

	const param = url.searchParams;
	const getType = param.get('type');

	//クエリパラメータに応じてデータを変更
	let mongoDBModels: BookInfoDBModel[] = [];
	switch (getType) {
		case 'recent':
			const mongoDBModel = await repos.getRecentBookInfo();
			return json(mongoDBModel ? mongoDBModel : null, { status: 200 });
		case 'wish':
		case 'reading':
		case 'complete':
			mongoDBModels = await repos.getBookInfosByStatus(getType);
			return json(mongoDBModels, { status: 200 });
		default:
			mongoDBModels = await repos.getBookInfos();
			return json(mongoDBModels, { status: 200 });
	}
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	const bookSearch = (await request.json()) as BookSearch;
	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);
	return await repos.insert(convertBookSearchToDBModel(userId?.value!, bookSearch));
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request, cookies }) => {
	const { userId, response } = await verifyTokenAndCollections(
		cookies.get('idToken')!,
		collections!
	);
	if (!response.ok) {
		return response;
	}

	//Postされたデータの型はモデルではなくEntity
	const item = (await request.json()) as { bookInfo: BookInfo; isCompleteReading: boolean };
	if (!validatePutBookInfo(item.bookInfo, item.isCompleteReading)) {
		return new Response('データが不正です', { status: 400 });
	}

	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);
	return await repos.update(convertBookInfoToDBModel(item.bookInfo), item.isCompleteReading);
};

/**DBの書誌データを削除する */
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

	const repos = new BookInfoMongoDBResource(collections?.bookInfos!, userId!);
	return await repos.delete(id);
};
