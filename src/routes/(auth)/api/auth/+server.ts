import type { RequestHandler } from './$types';
import { firebaseAdminAuth } from '$lib/server/firebase.server';

const cookieName = 'idToken';

/**ログイン情報を確認し、クッキーに保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const token = await request.json();
  cookies.delete(cookieName, { path: '/' });

  try {
    //クライアント側での認証情報が正しいか確認する。
    //(認証自体はフロントのfirebaseで行って、サーバーで不正な処理でないかを確認する)
    const decodeIdToken = await firebaseAdminAuth.verifyIdToken(token);
    
    cookies.set(cookieName, token, { path: '/' , httpOnly: true, secure: true });
  }
  catch (error){
    console.log(error);
    return new Response('データが不正です', { status: 400}); 
  }

  return new Response('ログインに成功しました。', { status: 200 });
};

/**クッキーを削除する */
export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete(cookieName, { path: '/' });

  return new Response('クッキーの削除に成功しました。', { status: 200 });
};