import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { verifyAndGetUid } from '$lib/server/verification';
import collections from '$lib/server/database/collections';
import BookInfoMongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';


export const GET: RequestHandler = async ({ url, cookies }) => {
  let mongoDBModel: BookInfoMongoDBModel[] = [];

  try {
    const id = await verifyAndGetUid(cookies.get('idToken'));
    const userId = new UserId(id!);
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }  
    
    mongoDBModel = await collections.bookInfos!.find({userId: userId.value}).toArray() as BookInfoMongoDBModel[];  
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }

  return json(mongoDBModel, {status: 200});    
};
