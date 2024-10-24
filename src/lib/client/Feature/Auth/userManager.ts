import { goto } from '$app/navigation';
import {
	mainToastTarget,
	pushErrorToast,
	pushSuccessToast
} from '$lib/client/Shared/Helpers/Toast';
import { APIRouteURLs } from '$lib/client/Shared/Constants/urls';
import { firebaseAuth } from '$lib/client/Feature/Auth/firebase';
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut
} from 'firebase/auth';

export const login = async (
	redirectPath: string,
	type: 'google' | 'email',
	email = '',
	password = ''
) => {
	let isSuccess = false;

	try {
		let idToken = '';
		if (type === 'google') {
			const userCredentials = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
			idToken = await userCredentials.user.getIdToken();
		} else {
			const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
			idToken = await userCredentials.user.getIdToken();
		}

		const response = await fetch(APIRouteURLs.auth, {
			method: 'POST',
			body: JSON.stringify(idToken),
			headers: { 'Content-type': 'application/json' }
		});

		isSuccess = true;
		goto(redirectPath);
	} catch (error) {
		console.log(error);
	}

	return isSuccess;
};

export const logout = async () => {
	try {
		await signOut(firebaseAuth);
		const response = await fetch(APIRouteURLs.auth, {
			method: 'DELETE'
		});
	} catch (error) {
		console.log(error);
	}

	goto('/login');
};

export const registerWithEmailAndPassword = async (
	redirectPath: string,
	email: string,
	password: string
) => {
	let isSuccess = false;

	try {
		await createUserWithEmailAndPassword(firebaseAuth, email, password);
		pushSuccessToast('登録が完了しました。');

		isSuccess = true;
		goto(redirectPath);
	} catch (error) {
		console.log(error);
		pushErrorToast('登録に失敗しました。');
	}

	return isSuccess;
};
