import { ObjectId, type Filter, type UpdateFilter } from 'mongodb';
import type { IBookInfoDBRepositories } from "$lib/server/Domain/repositories/BookInfoDB";
import type { bookInfosCollection } from "$lib/server/Infrastructure/MongoDB/MongoDBHelper";
import DBModel from "$lib/server/Domain/Entities/MongoDBModel/BookInfo";
import type { id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import type { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import type { status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import type { pageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";

/**MongoDBでの書誌データ操作を管理する */
export class BookInfoMongoDBResource implements IBookInfoDBRepositories {
  /**
   * MongoDB接続用コンストラクタ
   * @param collection MongoDBのBookInfoコレクションへの接続情報
   * @param userId 操作対象のUserId
   */
  constructor (private readonly _collection: bookInfosCollection, private readonly _userId: UserId) {
  }
  
  async get(): Promise<DBModel[]> {
    //これ取れなかったらちゃんとエラーを投げるようにしないとダメだ

    
    let mongoDBModel: DBModel[] = [];
  
    try {
      mongoDBModel = await this._collection.find({userId: this._userId.value}).toArray() as DBModel[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
  
    return mongoDBModel;
  }

  async getByStatus(status: status): Promise<DBModel[]> {
    let mongoDBModel: DBModel[] = [];
  
    try {
      const filter: Filter<DBModel> = {
        $and: [
          {userId: this._userId.value},
          {status: status}
        ]
      };
      mongoDBModel = await this._collection.find(filter).toArray() as DBModel[];  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }
  
    return mongoDBModel;
  }

  async getRecent(): Promise<DBModel | undefined> {
    let mongoDBModel: DBModel | undefined;

    try {
      //pageHistoryが0より大きいデータを、更新日を降順にしてから、1個だけ取る
      const cursor = await this._collection.find({
          userId: this._userId.value,
          "pageHistories.0": { $exists: true}
        }).sort({updateDate: -1}).limit(1);  
      mongoDBModel = await cursor.hasNext() ? await cursor.next() as DBModel : undefined;
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }

    return mongoDBModel;
  }

  async getPageHistory(): Promise<Array<pageHistory[]>> {
    let histories: Array<{pageHistories: pageHistory[]}> = [];

    try {
      //pageHistoriesのみを取得(_idは指定無しでも取れるので、取らないように明示する)
      const projection = { _id: 0, pageHistories: 1};
      histories = await this._collection.find({userId: this._userId.value}).project(projection).toArray() as Array<{pageHistories: pageHistory[]}>;  
    }
    catch (error) {
      console.log(error);
      console.log('書誌データの取得に失敗しました。');
    }

    return histories.map(item => item.pageHistories);
  }

  async insert(bookInfo: DBModel): Promise<Response> {
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

  async update(bookInfo: DBModel, isCompleteReading: boolean): Promise<Response> {
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
        isFavorite: bookInfo.isFavorite,
        pageCount: bookInfo.pageCount,
        status: bookInfo.status,
        pageHistories: bookInfo.pageHistories,
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

  async delete(id: id): Promise<Response> {
    let response = new Response('書誌データの削除に失敗しました。', {status: 400});

    try {
      const result = await this._collection.deleteOne({_id: new ObjectId(id)});
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
      const mongoDBModel = await this._collection.find({userId: this._userId.value, gapiId: keyId}).toArray() as DBModel[];
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