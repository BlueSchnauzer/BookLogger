import type { PageServerLoad } from './$types';
import { MONGOURL } from '$env/static/private';
import  mongoose  from 'mongoose';
import { BookInfoModel, type IBookInfo } from '$lib/server/models/BookInfo';

export const load = (async () => {
    let bookInfos: IBookInfo[] = [];
    try {
        await mongoose.connect(MONGOURL);
        
        bookInfos = await BookInfoModel.find({userId: 1}).exec();
        console.log(bookInfos);
    }
    catch (ex) {
        console.log(`接続に失敗しました。エラー：${ex}`);
    }

    //pojoでないとエラーになるため一度シリアライズする。
    return { bookInfos: JSON.parse(JSON.stringify(bookInfos)) };
}) satisfies PageServerLoad;