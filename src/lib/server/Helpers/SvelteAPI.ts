import { verifyAndGetUid } from '$lib/server/verification';
import { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';

//verifyAndGetUid()はどっかのタイミングで共通関数で置きなおす。

/**クッキー内のidTokenを検証してUserId型にして返す */
export const verifyAndCreateUserId = async (idToken: string) => {
	let userId;

	try {
		const token = await verifyAndGetUid(idToken);
		userId = new UserId(token!);
	} catch (error) {
		console.log(error);
		console.log('UserIdの取得に失敗しました。');
		return undefined;
	}

	return userId;
};
