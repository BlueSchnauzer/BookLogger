import { goto } from '$app/navigation';
import { mainToastTarget, pushErrorToast, pushSuccessToast } from '$lib/client/Helpers/Toast';
import { authAPIRoute } from '$lib/client/Shared/Constants/requestUrls';
import { firebaseAuth } from '$lib/firebase.client';
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

		const response = await fetch(authAPIRoute, {
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
		const response = await fetch(authAPIRoute, {
			method: 'DELETE'
		});
	} catch (error) {
		console.log(error);
	}
};

export const registerWithEmailAndPassword = async (
	redirectPath: string,
	email: string,
	password: string
) => {
	let isSuccess = false;

	try {
		await createUserWithEmailAndPassword(firebaseAuth, email, password);
		pushSuccessToast('登録が完了しました。', mainToastTarget);

		isSuccess = true;
		goto(redirectPath);
	} catch (error) {
		console.log(error);
		pushErrorToast('登録に失敗しました。', mainToastTarget);
	}

	return isSuccess;
};
