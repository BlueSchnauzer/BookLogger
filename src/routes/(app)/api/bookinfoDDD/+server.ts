import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { verifyAndGetUid } from '$lib/server/verification';
import collections from '$lib/server/database/collections';
import DBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import type { books_v1 } from 'googleapis';
import type { BookInfo } from '$lib/server/Domain/Entities/BookInfo';
import { ObjectId, type UpdateFilter } from 'mongodb';
import { BookInfoMongoDB } from '$lib/server/Infrastructure/MongoDB/BookInfoDB';
import { verifyAndCreateUserId } from '$lib/server/Helpers/SvelteAPI';
import type { IBookInfoDBRepositories } from '$lib/server/Domain/repositories/BookInfoDB';

/**書誌データを取得する
 * クエリパラメータに応じて返却するデータを変更する。
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
  let repos: IBookInfoDBRepositories;

  try {
    const userId = await verifyAndCreateUserId(cookies.get('idToken')!);
    if (!collections) { return new Response('サーバーエラー', { status: 500 }); }

    repos = new BookInfoMongoDB(collections.bookInfos!, userId!);
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
    return new Response('サーバーエラー', { status: 500 });
  }

  //クエリパラメータに応じてデータを変更
  let mongoDBModel: DBModel[] = [];
  if (url.searchParams.get('recent') === 'true') {
    mongoDBModel = await repos.getRecent();
  } else if (url.searchParams.get('wish') === 'true') {
    mongoDBModel = await repos.getByStatus('wish');
  } else if (url.searchParams.get('reading') === 'true') {
    mongoDBModel = await repos.getByStatus('reading');
  } else if (url.searchParams.get('complete') === 'true') {
    mongoDBModel = await repos.getByStatus('complete');
  } else {
    mongoDBModel = await repos.get();
  }

  return json(mongoDBModel, { status: 200 });
};

/**DBに書誌データを保存する */
export const POST: RequestHandler = async ({ request, cookies }) => {
  let response = new Response('書誌データの作成に失敗しました。', {status: 400});

  try {
    const idToken = await verifyAndGetUid(cookies.get('idToken'));
    const userId = new UserId(idToken!);
    const item = await request.json() as books_v1.Schema$Volume;

    //重複確認
    // if (await this.isDuplicate(bookInfo.gapiId!)){
    //   return new Response('登録済みの書誌データです。', {status: 409}); //409conflict
    // }
  
    const result = await collections?.bookInfos!.insertOne(new DBModel(item, userId.value));
    if (result?.acknowledged){
      response = new Response('書誌データの作成に成功しました。', {status: 201} );
    }
  }
  catch (error) {
    console.log(error);
    response = new Response('書誌データの作成に失敗しました。', {status: 500});
  }

  return response;
};

/**DBの書誌データを更新する */
export const PUT: RequestHandler = async ({ request, cookies }) => {
  let response = new Response('書誌データの更新に失敗しました。', {status: 400});

  try{
    //使わないけど不正かどうかを判断する必要がある。
    const idToken = await verifyAndGetUid(cookies.get('idToken'));
    const userId = new UserId(idToken!);
    const item = await request.json() as {bookInfo: BookInfo, isComplete: boolean};

    //作り直してから呼ぶ
    //if (!validatePutItem(item)) { return new Response('データが不正です', { status: 400}); }
    const mongoDBModel = new DBModel(item.bookInfo);

    //読み終わっている場合のみcompleteDateを更新対象にする
    //($currentDateがreadOnlyかつ、falseを設定できないので事前に分岐させて処理)
    let updateFilter;
    if (item.isComplete){
      updateFilter = {
        $currentDate: {
          updateDate: true,
          completeDate: true
        }
      } as UpdateFilter<DBModel>
    } else {
      updateFilter = {
        $currentDate: {
          updateDate: true
        }
      } as UpdateFilter<DBModel>
    }

    //(日付以外は)以下の項目のみ更新
    updateFilter.$set = {
      isFavorite: mongoDBModel.isFavorite,
      pageCount: mongoDBModel.pageCount,
      status: mongoDBModel.status,
      pageHistories: mongoDBModel.pageHistories,
      memorandum: mongoDBModel.memorandum
    }

    const result = await collections?.bookInfos!.updateOne({_id: new ObjectId(mongoDBModel._id)}, updateFilter);

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
};

/**DBの書誌データを削除する */
export const DELETE: RequestHandler = async ({ request, cookies }) => {
  let response = new Response('書誌データの削除に失敗しました。', {status: 400});

  try {
    //使わないけど不正かどうかを判断する必要がある。
    const idToken = await verifyAndGetUid(cookies.get('idToken'));
    const userId = new UserId(idToken!);

    const id: string = await request.json();
    if (!id) { return new Response('データが不正です', { status: 400}); }

    const result = await collections?.bookInfos!.deleteOne({_id: new ObjectId(id)});
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
};

//どっかに作り直す
/**更新用データが不正でないか確認する */
const validatePutItem = ({bookInfo, isComplete}: {bookInfo: BookInfo, isComplete: boolean}): boolean => {
  let result = true;

  //作成直後はhistoryが空なのでそのままtrue、編集してある場合は中身が不正でないか調べる。
  if (!bookInfo.pageHistories) { return result; }
  bookInfo.pageHistories.forEach(item => {
      if (!result) { return; }

      if (!item.value.date) {
          result = false;
          return;
      }
      //汎用処理なのでどっかに作り直してから呼ぶ
      // if (!validateReadingCount(item.value.pageCount, bookInfo.pageCount)) {
      //     result = false;
      //     return;
      // }
  });

  //読み終わっている場合、最終ページの記録があるか確認
  if (isComplete && result){
      const isExist = bookInfo.pageHistories.findIndex(item => item.value.pageCount === bookInfo.pageCount);
      result = isExist !== -1 ? true : false;
  }

  return result;
}