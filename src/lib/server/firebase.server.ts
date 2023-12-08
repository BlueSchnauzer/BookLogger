import {
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL
} from '$env/static/private'
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public';
import { credential } from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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

export const firebaseAdminAuth = getAuth(firebaseAdmin);