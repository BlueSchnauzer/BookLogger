import type { IBookInfoRepositories } from "$lib/server/Domain/repositories/BookInfo";
import type { bookInfosCollection } from "$lib/server/Infrastructure/MongoDB/MongoDBHelper";
import type { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { status } from "$lib/customTypes";
import { ObjectId, type Filter, type UpdateFilter } from 'mongodb';

/**MongoDBでの書誌データ操作を管理する */
export class BookInfoMongoDB implements IBookInfoRepositories {
  /**
   * MongoDB接続用コンストラクタ
   * @param collection MongoDBのBookInfoコレクションへの接続情報
   * @param userId 操作対象のUserId
   */
  constructor (private readonly _collection: bookInfosCollection, private readonly _userId: UserId) {
  }
  
  async get(): Promise<BookInfo[]> {
    let bookInfos: BookInfo[] = [];
  
    try {
      bookInfos = await this._collection.find({userId: this._userId}).toArray() as BookInfo[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
  
    return bookInfos;
  }

  async getByStatus(status: status): Promise<BookInfo[]> {
    let bookInfos: BookInfo[] = [];
  
    try {
      const filter: Filter<BookInfo> = {
        $and: [
          {userId: this._userId},
          {status}
        ]
      };
      bookInfos = await this._collection.find(filter).toArray() as BookInfo[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
  
    return bookInfos;
  }

  async getRecent(): Promise<BookInfo[]> {
    let bookInfos: BookInfo[] = [];

    try {
      //pageHistoryが0より大きいデータを、更新日を降順にしてから、1個だけ取る
      bookInfos = await this._collection.find({
          userId: this._userId,
          "pageHistory.0": { $exists: true}
        }).sort({updateDate: -1}).limit(1).toArray() as BookInfo[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }

    return bookInfos;
  }

  async getPageHistory(): Promise<BookInfo[]> {
    //pageHistoryだけ取得するが、まとめて1つの配列にはできないので書誌データごとに取得する。
    let histories: BookInfo[] = [];

    try {
      //pageHistoryのみを取得(_idは指定無しでも取れるので、取らないように明示する)
      const projection = { _id: 0, pageHistory: 1};
      histories = await this._collection.find({userId: this._userId}).project(projection).toArray() as BookInfo[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }

    return histories;
  }

  async insert(bookInfo: BookInfo): Promise<Response> {
    let response = new Response('書誌データの作成に失敗しました。', {status: 400});
    if (await this.isDuplicate(bookInfo.gapiId!)){
      return new Response('登録済みの書誌データです。', {status: 409}); //409conflict
    }
  
    try {
      const result = await this._collection?.insertOne(bookInfo);
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

  async update(bookInfo: BookInfo, isCompleteReading: boolean): Promise<Response> {
    let response = new Response('書誌データの更新に失敗しました。', {status: 400});

    try{
      //読み終わっている場合のみcompleteDateを更新対象にする
      //($currentDateがreadOnlyかつ、falseを設定できないので事前に分岐させて処理)
      let updateFilter;
      if (isCompleteReading){
        updateFilter = {
          $currentDate: {
            updateDate: true,
            completeDate: true
          }
        } as UpdateFilter<BookInfo>
      } else {
        updateFilter = {
          $currentDate: {
            updateDate: true
          }
        } as UpdateFilter<BookInfo>
      }
  
      //(日付以外は)以下の項目のみ更新
      updateFilter.$set = {
        isFavorite: bookInfo.isFavorite,
        pageCount: bookInfo.pageCount,
        status: bookInfo.status,
        pageHistory: bookInfo.pageHistory,
        memorandum: bookInfo.memorandum
      }
  
      const result = await this._collection.updateOne({_id: new ObjectId(bookInfo._id)}, updateFilter);
  
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

  async delete(bookInfo: BookInfo): Promise<Response> {
    let response = new Response('書誌データの削除に失敗しました。', {status: 400});

    try {
      const result = await this._collection.deleteOne({_id: new ObjectId(bookInfo._id)});
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

  async isDuplicate(keyId: string): Promise<boolean> {
    let isDuplicate = false;

    try {
      const bookInfos = await this._collection.find({userId: this._userId, gapiId: keyId}).toArray() as BookInfo[];
      isDuplicate = bookInfos.length === 0 ? false : true;
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
    
    return isDuplicate;
  }
}