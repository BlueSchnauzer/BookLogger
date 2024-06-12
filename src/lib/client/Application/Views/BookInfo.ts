import type { typeForBottomLabel } from "$lib/customTypes";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";

/**単一のBookInfoを受け取り、画面表示用に操作するView */
export class BookInfoView {
  constructor(public bookInfo: BookInfo) { }

  /**タイトルを取得する(存在しなければ「データ無し」を返す) */
  public getTitleLabel() {
    return this.bookInfo.title ?? 'データ無し';
  }

  /**書誌データの日付を画面表示用の形式に変換する。 */
  public getDateLabel(dateType: 'create' | 'update' | 'complete', useYear = true): string {
    let target: Date | undefined;
    switch (dateType) {
      case 'create':
        target = this.bookInfo.createDate;
        break;
      case 'update':
        target = this.bookInfo.updateDate;
        break;
      case 'complete':
        target = this.bookInfo.completeDate;
        break;
    }
    if (!target) { return 'データ無し'; }

    //DBから取った書誌データは文字列で日付を持ってるため
    if (typeof target === 'string') { target = new Date(target); }
    return `${useYear ? `${target.getFullYear()}/` : ''}${target.getMonth() + 1}/${target.getDate()}`;
  }

  /**グリッドアイテムのラベル表示用のタイプを判定して返す。 */
  public getTypeForBottomLabel(pathName: string): typeForBottomLabel {
    switch (pathName) {
      case '/home':
        return 'progress';
      case '/books':
        return 'createDate';
      case '/books/wish':
        return 'createDate';
      case '/books/reading':
        return 'progress';
      default:
        return 'completeDate';
    }
  }
}