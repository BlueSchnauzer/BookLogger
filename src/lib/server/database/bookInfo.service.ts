import * as mongoDB from 'mongodb';
import type { BookInfo } from '$lib/server/models/BookInfo';
import type { collections } from '$lib/server/database/collections';
import type { status } from '$lib/customTypes';

/**ユーザIDに紐づいた書誌データを取得する */
export async function getBookInfo(collections: collections, userId: string): Promise<BookInfo[]>{
  let bookInfos: BookInfo[] = [];
  if (typeof userId !== 'string') { return bookInfos; }

  try {
    bookInfos = await collections.bookInfos?.find({userId}).toArray() as BookInfo[];  
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }

  return bookInfos;
}

/**直近で読んだ、ユーザIDに紐づいた書誌データを1件取得する */
export async function getRecentBookInfo(collections: collections, userId: string): Promise<BookInfo[]>{
  let bookInfos: BookInfo[] = [];
  if (typeof userId !== 'string') { return bookInfos; }

  try {
    //pageHistoryが0より大きいデータを、更新日を降順にしてから、1個だけ取る
    bookInfos = await collections.bookInfos?.find({
        userId,
        "pageHistory.0": { $exists: true}
      }).sort({updateDate: -1}).limit(1).toArray() as BookInfo[];  
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }

  return bookInfos;
}

/**ユーザIDに紐づいた書誌データから、pageHistoryのみを取得する */
export async function getBookInfoWithOnlyPageHistory(collections: collections, userId: string) {
  //pageHistoryだけ取得するが、まとめて1つの配列にはできないので書誌データごとに取得する。
  let histories: BookInfo[] = [];
  if (typeof userId !== 'string') { return []; }

  try {
    //pageHistoryのみを取得(_idは指定無しでも取れるので、取らないように明示する)
    const projection = { _id: 0, pageHistory: 1};
    histories = await collections.bookInfos?.find({userId}).project(projection).toArray() as BookInfo[];  
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }

  return histories;
}

/**statusが引数と一致し、ユーザIDに紐づいた書誌データを取得する */
export async function getBookInfoByStatus(collections: collections, userId: string, status: status): Promise<BookInfo[]>{
  let bookInfos: BookInfo[] = [];
  if (typeof userId !== 'string') { return bookInfos; }

  try {
    const filter: mongoDB.Filter<BookInfo> = {
      $and: [
        {userId},
        {status}
      ]
    };
    bookInfos = await collections.bookInfos?.find(filter).toArray() as BookInfo[];  
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

/**同様の書誌データが既に保存されているか */
export async function isDuplicateBookInfo(collections: collections, userId: string, gapiId: string): Promise<boolean> {
  let isDuplicate = false;

  try {
    const bookInfos = await collections.bookInfos?.find({userId, gapiId}).toArray() as BookInfo[];
    isDuplicate = bookInfos.length === 0 ? false : true;
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }
  
  return isDuplicate;
}

/**書誌データを更新する */
export async function updateBookInfo(collections: collections, bookInfo: BookInfo, isComplete = false): Promise<Response>{
  let response = new Response('書誌データの更新に失敗しました。', {status: 400});

  try{
    //読み終わっている場合のみcompleteDateを更新対象にする
    //($currentDateがreadOnlyかつ、falseを設定できないので事前に分岐させて処理)
    let updateFilter;
    if (isComplete){
      updateFilter = {
        $currentDate: {
          updateDate: true,
          completeDate: true
        }
      } as mongoDB.UpdateFilter<BookInfo>
    } else {
      updateFilter = {
        $currentDate: {
          updateDate: true
        }
      } as mongoDB.UpdateFilter<BookInfo>
    }

    //(日付以外は)以下の項目のみ更新
    updateFilter.$set = {
      isFavorite: bookInfo.isFavorite,
      pageCount: bookInfo.pageCount,
      status: bookInfo.status,
      pageHistory: bookInfo.pageHistory,
      memorandum: bookInfo.memorandum
    }

    const result = await collections.bookInfos?.updateOne({_id: new mongoDB.ObjectId(bookInfo._id)}, updateFilter);

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