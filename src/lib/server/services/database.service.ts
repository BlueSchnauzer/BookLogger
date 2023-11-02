import * as mongoDB from 'mongodb';
import * as env from '$env/static/private';
import type { BookInfo } from '../models/BookInfo';

export const collections: {bookInfos?: mongoDB.Collection<BookInfo>} = {}
let isConnected = false;

/**データベースへ接続する(接続済みの場合は何もしない) */
export async function connectToDatabase() {
  if (isConnected) { return; }

  try {
    const client = new mongoDB.MongoClient(env.MONGO_URL);
    //接続状態を記録するイベントを設定
    client.on('open', () => isConnected = true);
    client.on('close', () => isConnected = false);
    await client.connect();
    
    const db: mongoDB.Db = client.db(env.DB_NAME);
  
    //コレクションの参照を取得
    const bookInfosCollection = db.collection<BookInfo>(env.BOOKINFOS_COLLECTION_NAME);
    collections.bookInfos = bookInfosCollection;
  
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${bookInfosCollection.collectionName}`)
  }
  catch (ex){
    console.log(`接続に失敗しました。エラー：${ex}`);
  }
}

/**ユーザIDに紐づいた書誌データを取得する */
export async function getBookInfoByUserId(userId: number): Promise<BookInfo[]>{
  let bookInfos: BookInfo[] = [];

  try {
    await connectToDatabase();
    bookInfos = await collections.bookInfos?.find({userId}).toArray() as BookInfo[];  
  }
  catch (error) {
    console.log(error);
    console.log('書誌データの取得に失敗しました。');
  }

  return bookInfos;
}

/**書誌データを保存する */
export async function insertBookInfo(bookinfo: BookInfo): Promise<Response>{
  let response = new Response('書誌データの作成に失敗しました。', {status: 400});

  try {
    await connectToDatabase();
    const result = await collections.bookInfos?.insertOne(bookinfo);
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
export async function updateBookInfo(bookInfo: BookInfo): Promise<Response>{
  let response = new Response('書誌データの更新に失敗しました。', {status: 400});

  try{
    await connectToDatabase();
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
    if (result?.acknowledged) {
      response = new Response('書誌データの更新に成功しました。', {status: 200});
    }
  }
  catch(error){
    console.log(error);
    response = new Response('書誌データの更新に失敗しました。', {status: 500});
  }

  return response;
}