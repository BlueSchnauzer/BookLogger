import type { PageServerLoad } from './$types';
import { connect } from '$lib/server/DB/connection';
import BookInfoModel, { type IBookInfo } from '$lib/server/models/BookInfo';

export const load = (async () => {
    let bookInfos: IBookInfo[] = [];
    await connect();
    bookInfos = await BookInfoModel.find({userId: 1}).exec();

    //pojoでないとエラーになるため一度シリアライズする。
    return { bookInfos: JSON.parse(JSON.stringify(bookInfos)) };
}) satisfies PageServerLoad;