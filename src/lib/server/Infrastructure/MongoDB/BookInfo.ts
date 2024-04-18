import type { IBookInfoRepositories } from "$lib/server/Domain/repositories/BookInfo";
import type { bookInfosCollection } from "$lib/server/Infrastructure/MongoDB/MongoDBHelper";
import { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import MongoDBModel from "$lib/server/Domain/Entities/MongoDBModel/BookInfo";
import type { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import type { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
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
    let mongoDBModel: MongoDBModel[] = [];
  
    try {
      mongoDBModel = await this._collection.find({userId: this._userId.value}).toArray() as MongoDBModel[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
  
    return mongoDBModel.map(item => BookInfo.fromDBModel(item));
  }

  async getByStatus(status: Status): Promise<BookInfo[]> {
    let mongoDBModel: MongoDBModel[] = [];
  
    try {
      const filter: Filter<MongoDBModel> = {
        $and: [
          {userId: this._userId.value},
          {status: status.value}
        ]
      };
      mongoDBModel = await this._collection.find(filter).toArray() as MongoDBModel[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
  
    return mongoDBModel.map(item => BookInfo.fromDBModel(item));
  }

  async getRecent(): Promise<BookInfo[]> {
    let mongoDBModel: MongoDBModel[] = [];

    try {
      //pageHistoryが0より大きいデータを、更新日を降順にしてから、1個だけ取る
      mongoDBModel = await this._collection.find({
          userId: this._userId.value,
          "pageHistories.0": { $exists: true}
        }).sort({updateDate: -1}).limit(1).toArray() as MongoDBModel[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }

    return mongoDBModel.map(item => BookInfo.fromDBModel(item));
  }

  async getPageHistory(): Promise<BookInfo[]> {
    //pageHistoryだけ取得するが、まとめて1つの配列にはできないので書誌データごとに取得する。
    let histories: BookInfo[] = [];

    try {
      //pageHistoryのみを取得(_idは指定無しでも取れるので、取らないように明示する)
      const projection = { _id: 0, pageHistory: 1};
      histories = await this._collection.find({userId: this._userId.value}).project(projection).toArray() as BookInfo[];  
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
      const result = await this._collection?.insertOne(new MongoDBModel(bookInfo));
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
    const mongoDBModel = new MongoDBModel(bookInfo);

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
        } as UpdateFilter<MongoDBModel>
      } else {
        updateFilter = {
          $currentDate: {
            updateDate: true
          }
        } as UpdateFilter<MongoDBModel>
      }
  
      //(日付以外は)以下の項目のみ更新
      updateFilter.$set = {
        isFavorite: mongoDBModel.isFavorite,
        pageCount: mongoDBModel.pageCount,
        status: mongoDBModel.status,
        pageHistories: mongoDBModel.pageHistories,
        memorandum: mongoDBModel.memorandum
      }
  
      const result = await this._collection.updateOne({_id: new ObjectId(mongoDBModel._id)}, updateFilter);
  
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

  async delete(id: Id): Promise<Response> {
    let response = new Response('書誌データの削除に失敗しました。', {status: 400});

    try {
      const result = await this._collection.deleteOne({_id: new ObjectId(id.value)});
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
      const mongoDBModel = await this._collection.find({userId: this._userId.value, gapiId: keyId}).toArray() as MongoDBModel[];
      isDuplicate = mongoDBModel.length === 0 ? false : true;
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
      
      throw error;
    }
    
    return isDuplicate;
  }
}