import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    //未ログインの場合はアクセスを弾く
    if (!cookies.get('uid')){
        throw redirect(302, '/login');
    }
    return {};
}) satisfies LayoutServerLoad;