import * as mongoDB from 'mongodb';
import type { BookInfo } from '$lib/server/models/BookInfo';
import type { collections } from '$lib/server/database/collections';

/**ユーザIDに紐づいた書誌データを取得する */
export async function getBookInfoByUserId(collections: collections, userId: number): Promise<BookInfo[]>{
  let bookInfos: BookInfo[] = [];

  try {
    bookInfos = await collections.bookInfos?.find({userId}).toArray() as BookInfo[];  
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }

  return bookInfos;
}

/**書誌データを保存する */
export async function insertBookInfo(collections: collections, bookInfo: BookInfo): Promise<Response>{
  let response = new Response('書誌データの作成に失敗しました。', {status: 400});

  try {
    const result = await collections.bookInfos?.insertOne(bookInfo);
    if (result?.acknowledged){
      response = new Response('書誌データの作成に成功しました。', {status: 201} );
    }
  }
  catch (error) {
    console.log(error);
    response = new Response('書誌データの作成に失敗しました。', {status: 500});
  }

  return response;
}

/**書誌データを更新する */
export async function updateBookInfo(collections: collections, bookInfo: BookInfo): Promise<Response>{
  let response = new Response('書誌データの更新に失敗しました。', {status: 400});

  try{
    //historyとmemorandumだけ保存
    const result = await collections.bookInfos?.updateOne(
      {_id: new mongoDB.ObjectId(bookInfo._id)},
      {
        $set: {
          isFavorite: bookInfo.isFavorite,
          history: bookInfo.history,
          memorandum: bookInfo.memorandum
        },
        $currentDate: {
          updateDate: true
        }
      }
    );

    if (result?.matchedCount === 0){
      return response;
    }
    else if (result?.acknowledged) {
      response = new Response('書誌データの更新に成功しました。', {status: 200});
    }
  }
  catch(error){
    console.log(error);
    response = new Response('書誌データの更新に失敗しました。', {status: 500});
  }

  return response;
}

/**書誌データを削除する */
export async function deleteBookInfo(collections: collections, _id: mongoDB.ObjectId): Promise<Response> {
  let response = new Response('書誌データの削除に失敗しました。', {status: 400});

  try {
    const result = await collections.bookInfos?.deleteOne({_id: new mongoDB.ObjectId(_id)});
    if (result && result.deletedCount){
      response = new Response('書誌データの削除に成功しました。', {status: 202} );
    } 
    else if (!result || !result.deletedCount) {
      return response;
    }
  }
  catch (error) {
    console.log(error);
    response = new Response('書誌データの削除に失敗しました。', {status: 500});
  }

  return response;
}