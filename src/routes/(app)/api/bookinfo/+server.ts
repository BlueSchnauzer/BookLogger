import type { RequestHandler } from './$types';
import { getBookInfoByUserId } from '$lib/server/services/database.service';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
    const userId = 1; //クッキーから取る？
    let bookInfos = await getBookInfoByUserId(userId);

    return json(bookInfos);
};