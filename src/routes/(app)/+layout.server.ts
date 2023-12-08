import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies }) => {
    console.log('app route')
    //未ログインの場合はアクセスを弾く
    if (!cookies.get('uid')){
        throw redirect(302, '/login');
    }

    console.log('success');
    return {};
}) satisfies LayoutServerLoad;