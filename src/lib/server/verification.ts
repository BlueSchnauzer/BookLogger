import { redirect } from "@sveltejs/kit";
import type { DecodedIdToken } from "firebase-admin/auth";
import { firebaseAdminAuth } from "$lib/server/firebase.server";

/**
 * idTokenがFalthyもしくは、idTokenの認証結果がFalthyの場合にログインページへリダイレクトする。
 * @param idToken firebase認証後のidToken
 * @param isRedirect 不正だった場合にリダイレクトするか
 * @returns デコードしたトークン情報
 */
export async function verifyAuthorisation(idToken: string | undefined, isRedirect: boolean): Promise<DecodedIdToken | undefined> {
  if (!idToken) {
    if (isRedirect) { throw redirect(302, '/login'); }
    return undefined;
  }

  const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);
  if (!decodedToken) {
    if (isRedirect) { throw redirect(302, '/login') }
    return undefined;
  }

  return decodedToken;
}

/**tokenを検証し、成功した場合にuidを返す。 */
export async function verifyAndGetUid(idToken: string | undefined): Promise<string | undefined> {
  const decodedToken = await verifyAuthorisation(idToken, false);

  let userId: string; 
  if (decodedToken?.uid) {
    userId = decodedToken.uid;
  }
  else {
    return undefined;
  }

  return userId;
}