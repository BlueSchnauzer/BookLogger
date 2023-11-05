import type { PageServerLoad } from './$types';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async ({fetch}) => {
    const response = await fetch('/api/bookinfo');
    let bookInfos: BookInfo[] = await response.json();

    return { bookInfos };
}) satisfies PageServerLoad;