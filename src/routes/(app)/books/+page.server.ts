import type { PageServerLoad } from './$types';
import { getBookInfoByUserId } from '$lib/server/services/database.service';
import type { BookInfo } from '$lib/server/models/BookInfo';

export const load = (async () => {
    let bookInfos: BookInfo[] = [];
    bookInfos = await getBookInfoByUserId(1);

    //pojoでないとエラーになるため一度シリアライズする。
    return { bookInfos: JSON.parse(JSON.stringify(bookInfos)) };
}) satisfies PageServerLoad;