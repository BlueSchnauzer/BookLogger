import type { typeForBottomLabel } from "$lib/customTypes";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";

/**単一のBookInfoを受け取り、画面表示用に操作するView */
export class BookInfoView {
  constructor(public bookInfo: BookInfo) { }

  /**書誌データを保存する。 */
  public insertBookInfo() {

  }

  /**書誌データを更新する。 */
  public updateBookInfo() {

  }

  /**書誌データを削除する。 */
  public deleteBookInfo() {

  }

  /**pageHisotryを追加する。 */
  public addPageHistory() {

  }

  /**StatusがCompleteに変更された際に、最終ページまでの記録が無ければ追加する。 */
  public changeToComplete() {

  }

  /**最終ページのpageHistoryがあるかを確認する。 */
  private hasCompleteHistory() {

  }

  /**タイトルを取得する(存在しなければ「データ無し」を返す) */
  public getTitleLabel() {
    return this.bookInfo.title ?? 'データ無し';
  }

  /**書誌データの日付を画面表示用の形式に変換する。 */
  public getDateLabel() {

  }

  /**グリッドアイテムのラベル表示用のタイプを判定して返す。 */
  public getTypeForBottomLabel(pathName: string): typeForBottomLabel {
    const typeForLabel =
      pathName === '/home' ? 'progress'
        : pathName === '/books' ? 'createDate'
          : pathName === '/books/wish' ? 'createDate'
            : pathName === '/books/reading' ? 'progress'
              : 'completeDate';

    return typeForLabel;
  }
}