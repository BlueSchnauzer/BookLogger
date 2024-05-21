import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";

/**BookInfoを配列で受け取り、画面表示用に操作するView */
export class BookInfoView {
  constructor(public bookInfos: BookInfo[]){}

  /**編集内容を反映した書誌データを返す(再レンダリングに使用) */
  public applyChange(bookInfos: BookInfo[], detail: { message: string; updatedItem: BookInfo; deletedId: Id }, isBooksRoute: boolean): void {
    let appliedItems: BookInfo[] = [];

    if (detail.updatedItem) {
      const oldItem = bookInfos.find(item => item.id === detail.updatedItem.id);
  
      if (!isBooksRoute && oldItem?.status !== detail.updatedItem.status){
        //全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
        appliedItems = bookInfos.filter(item => item.id !== detail.updatedItem.id);
      }
      else {
        //編集したアイテムを一覧に反映する
        const index = bookInfos.findIndex(item => item.id === detail.updatedItem.id);
        appliedItems = [...bookInfos.slice(0, index), detail.updatedItem, ...bookInfos.slice(index + 1)];	
      }
    }
    if (detail.deletedId) {
      //削除したアイテムを一覧からも削除する
      appliedItems = bookInfos.filter(item => item.id !== detail.deletedId);
    }
     
    this.bookInfos = appliedItems;
  }

  // /**お気に入り状態の書誌データのみを表示状態にして返す(再レンダリングに使用) */
  // toggleFavorite(bookInfos: BookInfo[]): BookInfo[] {
  //   throw new Error("Method not implemented.");
  // }

  // /**成功用トーストを表示し、編集内容を反映した書誌データを返す(再レンダリングに使用) */
  // handleSuccess(bookInfos: BookInfo[], detail: { message: string; updatedItem: BookInfo; deletedId: Id; }, target: string, isBooksRoute = false): BookInfo[] {
  //   const appliedItems = this.applyChange(bookInfos, detail, isBooksRoute);
  //   //pushSuccessToast(detail.message, target);
  
  //   return appliedItems;
  // }
}