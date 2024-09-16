import { redirect } from '@sveltejs/kit';
import { verifyAuthorisation } from '$lib/server/Feature/Auth/idManager';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	//ログイン中の場合はホームに移動する。
	const idToken = cookies.get('idToken');
	if (await verifyAuthorisation(idToken!, false)) {
		throw redirect(302, '/home');
	}

	return {};
}) satisfies LayoutServerLoad;
