import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { verifyAuthorisation } from '$lib/server/verification';

export const load = (async ({ cookies }) => {
	//クッキーが無い、もしくはverifyが通らない場合は不正なアクセスなので弾く。
	const idToken = cookies.get('idToken');
	await verifyAuthorisation(idToken!, true);

	return {};
}) satisfies LayoutServerLoad;
