import type { RequestHandler } from './$types';
import { firebaseAdminAuth } from '$lib/server/firebase.server';

/**ログイン情報を確認し、クッキーに保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
  const token = await request.json();
  const cookieName = 'uid';
  cookies.delete(cookieName, { path: '/' });

  try {
    console.log('api route');
    console.log(token);
    //クライアント側での認証情報が正しいか確認し、uidを取得する。
    const uid = (await firebaseAdminAuth.verifyIdToken(token)).uid;
    
    cookies.set(cookieName, uid, { path: '/' });
  }
  catch (error){
    console.log(error);
    return new Response('データが不正です', { status: 400}); 
  }

  return new Response('ログインに成功しました。', { status: 200 });
};