import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { BookSearch } from '$lib/client/Domain/Entities/BookSearch';
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

/**書誌データを取得する
 * クエリパラメータに応じて返却するデータを変更する。
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
	if (!userId) {
		return new Response('ログイン情報が不正です', { status: 400 });
	}
	if (!collections) {
		return new Response('サーバーエラー', { status: 500 });
	}

	const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId!);

	const param = url.searchParams;
	const getType = param.get('type');

	//クエリパラメータに応じてデータを変更
	let mongoDBModels: BookInfoDBModel[] = [];
	switch (getType) {
		case 'recent':
			const mongoDBModel = await repos.getRecent();
			return json(mongoDBModel ? mongoDBModel : null, { status: 200 });
		case 'wish':
		case 'reading':
		case 'complete':
			mongoDBModels = await repos.getByStatus(getType);
			return json(mongoDBModels, { status: 200 });
		default:
			mongoDBModels = await repos.get();
			return json(mongoDBModels, { status: 200 });
	}
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
	if (!userId) {
		return new Response('ログイン情報が不正です', { status: 400 });
	}
	if (!collections) {
		return new Response('サーバーエラー', { status: 500 });
	}

	const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId!);

	const bookSearch = (await request.json()) as BookSearch;
	return await repos.insert(convertBookSearchToDBModel(userId.value, bookSearch));
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request, cookies }) => {
	const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
	if (!userId) {
		return new Response('ログイン情報が不正です', { status: 400 });
	}
	if (!collections) {
		return new Response('サーバーエラー', { status: 500 });
	}

	//Postされたデータの型はモデルではなくEntity
	const item = (await request.json()) as { bookInfo: BookInfo; isCompleteReading: boolean };
	const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId);

	if (!validatePutBookInfo(item.bookInfo, item.isCompleteReading)) {
		return new Response('データが不正です', { status: 400 });
	}
	return await repos.update(convertBookInfoToDBModel(item.bookInfo), item.isCompleteReading);
};

/**DBの書誌データを削除する */
export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
	if (!userId) {
		return new Response('ログイン情報が不正です', { status: 400 });
	}
	if (!collections) {
		return new Response('サーバーエラー', { status: 500 });
	}

	const id: string = await request.json();
	if (!id) {
		return new Response('データが不正です', { status: 400 });
	}

	const repos = new BookInfoMongoDBResource(collections.bookInfos!, userId);

	return await repos.delete(id);
};
