import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import { pushSuccessToast } from "$lib/client/Application/Utils/toast";
import type { bookInfoDispatchParameter } from "../Utils/dispatcher";
import { BookInfoView } from "$lib/client/Application/Views/BookInfo";

/**BookInfoを配列で受け取り、画面表示用に操作するView */
export class BookInfoArrayView {
  public bookInfoViews: BookInfoView[];
  constructor(public bookInfos: BookInfo[]) {
    this.bookInfoViews = bookInfos.map(item => new BookInfoView(item));
  }

  /**成功用トーストを表示し、編集内容を反映した書誌データを返す(再レンダリングに使用) */
  public handleSuccess(bookInfos: BookInfo[], detail: bookInfoDispatchParameter, target: string, isBooksRoute = false): void {
    const appliedItems = this.applyChange(bookInfos, detail, isBooksRoute);
    pushSuccessToast(detail.message, target);

    this.bookInfos = appliedItems;
  }

  /**編集内容を反映した書誌データを返す(再レンダリングに使用) */
  private applyChange(bookInfos: BookInfo[], detail: bookInfoDispatchParameter, isBooksRoute: boolean): BookInfo[] {
    let appliedItems: BookInfo[] = [];

    if (detail.updatedItem) {
      const oldItem = bookInfos.find(item => item.id?.equals(detail.updatedItem?.id!));

      if (!isBooksRoute && !oldItem?.status.equals(detail.updatedItem.status)) {
        //全データ表示時以外で、ステータスが変わった場合は一覧から削除して、現在の表示から削除する
        appliedItems = bookInfos.filter(item => item.id?.equals(detail.updatedItem?.id!));
      }
      else {
        //編集したアイテムを一覧に反映する
        const index = bookInfos.findIndex(item => item.id?.equals(detail.updatedItem?.id!));
        appliedItems = [...bookInfos.slice(0, index), detail.updatedItem, ...bookInfos.slice(index + 1)];
      }
    }
    if (detail.deletedId) {
      //削除したアイテムを一覧からも削除する
      appliedItems = bookInfos.filter(item => item.id?.equals(detail.deletedId!));
    }

    return appliedItems;
  }

  // /**お気に入り状態の書誌データのみを表示状態にして返す(再レンダリングに使用) */
  // toggleFavorite(bookInfos: BookInfo[]): BookInfo[] {
  //   throw new Error("Method not implemented.");
  // }
}