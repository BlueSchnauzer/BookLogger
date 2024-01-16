import type { ObjectId } from "mongodb";
import type { BookInfo } from "./BookInfo";

/**書棚情報 */
export class BookShelf {
  public bookShelfName: string;
  public bookInfoIds: ObjectId[];
  public createDate: Date;
  public updateDate: Date;
  public _id?: ObjectId;

  constructor(name: string, bookInfoIds: ObjectId[]){
    const currentDate = new Date;

    this.bookShelfName = name;
    this.bookInfoIds = bookInfoIds.length !== 0 ? bookInfoIds : [];
    this.createDate = currentDate;
    this.updateDate = currentDate;
  }
}