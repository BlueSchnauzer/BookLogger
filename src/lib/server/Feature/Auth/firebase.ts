import { FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL } from '$env/static/private';
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

//ビルド時に名前付きエクスポートするとエラーになるので、一度デフォルトエクスポートを挟んでから取得
const { credential } = admin;
let firebaseAdmin;

if (!getApps().length) {
	firebaseAdmin = initializeApp({
		credential: credential.cert({
			privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
			clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
			projectId: PUBLIC_FIREBASE_PROJECT_ID
		})
	});
}

const firebaseAdminAuth = getAuth(firebaseAdmin);

export { firebaseAdminAuth };
