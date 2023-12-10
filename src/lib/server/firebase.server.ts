import {
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL
} from '$env/static/private'
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

//ビルド時に名前付きエクスポートするとエラーになるので、一度デフォルトエクスポートを挟んでから取得
const { credential } = admin;
let firebaseAdmin;

if (!getApps().length) {
  firebaseAdmin = initializeApp({
    credential: credential.cert({
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: PUBLIC_FIREBASE_PROJECT_ID
    })
  })
}

const firebaseAdminAuth = getAuth(firebaseAdmin);

/**
 * idTokenがFalthyもしくは、idTokenの認証結果がFalthyの場合にログインページへリダイレクトする。
 * @param idToken firebase認証後のidToken
 * @param isRedirect 不正だった場合にリダイレクトするか
 * @returns 
 */
const verifyAuthorisation = async (idToken: string, isRedirect: boolean): Promise<boolean> => {
  if (!idToken || await !firebaseAdminAuth.verifyIdToken(idToken)) {
    if (isRedirect) { throw redirect(302, '/login') }
    return false;
  }

  return true;
}

export { firebaseAdminAuth, verifyAuthorisation};
