import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	//ルートにアクセスした場合は、ログイン画面にリダイレクトする。
	throw redirect(302, '/login');

	return {};
}) satisfies PageServerLoad;
