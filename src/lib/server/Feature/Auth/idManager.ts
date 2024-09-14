import { UserId } from '$lib/client/Domain/ValueObjects/BookInfo/UserId';
import { firebaseAdminAuth } from '$lib/server/firebase.server';
import { redirect } from '@sveltejs/kit';

/**
 * idTokenがFalthyもしくは、idTokenの認証結果がFalthyの場合にログインページへリダイレクトする。
 * @param idToken firebase認証後のidToken
 * @param isRedirect 不正だった場合にリダイレクトするか
 * @returns デコードしたトークン情報
 */
export const verifyAuthorisation = async (idToken: string | undefined, isRedirect: boolean) => {
	if (!idToken) {
		if (isRedirect) {
			throw redirect(302, '/login');
		}
		return undefined;
	}

	const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
	if (!decodedToken) {
		if (isRedirect) {
			throw redirect(302, '/login');
		}
		return undefined;
	}

	return decodedToken;
};

/**クッキー内のidTokenを検証してUserId型にして返す */
export const verifyAndCreateUserId = async (idToken: string) => {
	try {
		const token = await verifyAndGetUid(idToken);
		return new UserId(token!);
	} catch (error) {
		console.log(error);
		console.log('UserIdの取得に失敗しました。');
		return undefined;
	}
};

const verifyAndGetUid = async (idToken: string | undefined) => {
	const decodedToken = await verifyAuthorisation(idToken, false);
	return decodedToken?.uid ? decodedToken.uid : undefined;
};
