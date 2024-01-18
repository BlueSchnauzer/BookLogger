import * as env from '$env/static/private';
import * as mongoDB from 'mongodb';
import type { BookInfo } from "$lib/server/models/BookInfo";
import type { BookShelf } from '$lib/server/models/BookShelf';

export type collections = {
  bookInfos?: mongoDB.Collection<BookInfo>
  bookShelves?: mongoDB.Collection<BookShelf>
}

let isConnected = false;

/**データベースへ接続する(接続済みの場合は何もしない) */
async function connectToDatabase() {
  if (isConnected) { return; }
  const collections: collections = {}

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

    const bookShelvesCollection = db.collection<BookShelf>(env.BOOKSHELVES_COLLECTION_NAME);
    collections.bookShelves = bookShelvesCollection;
  
    console.log(`Successfully connected to database: ${db.databaseName}.`)

    return collections;
  }
  catch (ex){
    console.log(`接続に失敗しました。エラー：${ex}`);
  }
}

/**DBに接続し、コレクションを返す */
export default await connectToDatabase();