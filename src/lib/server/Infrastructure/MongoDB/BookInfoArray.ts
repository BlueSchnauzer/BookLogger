import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import type { IBookInfoArray } from "$lib/server/Domain/repositories/BookInfoArray";

export class BookInfoMongoDBArray implements IBookInfoArray {
  applyChange(detail: { message: string; updatedItem: BookInfo; deletedId: Id; }, isBooksRoute: boolean): BookInfo[] {
    throw new Error("Method not implemented.");
  }
  toggleFavorite(): BookInfo[] {
    throw new Error("Method not implemented.");
  }
  handleSuccess(detail: { message: string; updatedItem: BookInfo; deletedId: Id; }, target: string, isBooksRoute: boolean): BookInfo[] {
    throw new Error("Method not implemented.");
  }

}