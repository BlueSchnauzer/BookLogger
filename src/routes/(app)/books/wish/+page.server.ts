import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async ({fetch}) => {
    //読みたい本のみを取得
    const response = await fetch('/api/bookinfo/wish');
    let bookInfos: BookInfo[] = await response.json();

    return { bookInfos };
}) satisfies PageServerLoad;