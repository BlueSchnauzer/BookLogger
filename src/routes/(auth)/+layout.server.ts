import { redirect } from '@sveltejs/kit';
import { verifyAuthorisation } from '$lib/server/Feature/Auth/idManager';
import type { LayoutServerLoad } from './$types';
import { HomeURLs } from '$lib/client/Shared/Constants/urls';

export const load = (async ({ cookies }) => {
	//ログイン中の場合はホームに移動する。
	const idToken = cookies.get('idToken');
	if (await verifyAuthorisation(idToken!, false)) {
		throw redirect(302, HomeURLs.home);
	}

	return {};
}) satisfies LayoutServerLoad;
