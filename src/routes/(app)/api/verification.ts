import { verifyAndCreateUserId } from '$lib/server/Feature/Auth/idManager';
import type { collections } from '$lib/server/Feature/Contents/MongoDB/MongoDBHelper';

export const verifyTokenAndCollections = async (idToken: string, collections: collections) => {
	const userId = await verifyAndCreateUserId(idToken);

	let response = new Response('', { status: 200 });
	if (!userId) {
		response = new Response('ログイン情報が不正です', { status: 400 });
	}
	if (!collections) {
		response = new Response('サーバーエラー', { status: 500 });
	}

	return { userId, response };
};
