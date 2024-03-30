import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";

/**BookInfoの配列を操作するリポジトリ */
export interface IBookInfoArray {
  /**編集内容を反映した書誌データを返す(再レンダリングに使用) */
  applyChange(bookInfos: BookInfo[], detail: {message: string, updatedItem: BookInfo, deletedId: Id}, isBooksRoute: boolean): BookInfo[]; 
  /**お気に入り状態の書誌データのみを表示状態にして返す(再レンダリングに使用) */
  toggleFavorite(bookInfos: BookInfo[]): BookInfo[];
  /**成功用トーストを表示し、編集内容を反映した書誌データを返す(再レンダリングに使用) */
  handleSuccess(bookInfos: BookInfo[], detail: {message: string, updatedItem: BookInfo, deletedId: Id}, target: string, isBooksRoute: boolean): BookInfo[];
}