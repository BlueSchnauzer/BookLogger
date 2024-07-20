import type { typeForBottomLabel } from "$lib/customTypes";
import type { BookInfo } from "$lib/server/Domain/Entities/BookInfo";
import type { Id } from "$lib/server/Domain/ValueObjects/BookInfo/Id";
import type { Identifiers } from "$lib/server/Domain/ValueObjects/BookInfo/Identifier";
import type { PageHistory } from "$lib/server/Domain/ValueObjects/BookInfo/PageHistory";
import type { Status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import type { UserId } from "$lib/server/Domain/ValueObjects/BookInfo/UserId";
import type { ObjectId } from "mongodb";

/**単一のBookInfoを受け取り、画面表示用に操作するView */
export class BookInfoView {
  public readonly id?: Id;
	public readonly userId: UserId;
	public readonly title: string;
	public readonly author: string[];
	public readonly thumbnail: string;
	public readonly createDate: Date;
	public readonly updateDate: Date;
	public readonly pageCount: number;
	public readonly isFavorite: boolean;
	public readonly status: Status;
	public readonly memorandum: string;
	public readonly isVisible: boolean;
	public readonly completeDate?: Date;
	public readonly pageHistories?: PageHistory[];
	public readonly identifiers?: Identifiers;
	public readonly shelfCategories?: ObjectId[]
	public readonly gapiId?: string;

  constructor(bookInfo: BookInfo) {
    this.id = bookInfo.getId();
    this.userId = bookInfo.getUserId();
    this.title = bookInfo.getTitle();
    this.author = bookInfo.getAuthor();
    this.thumbnail = bookInfo.getThumbnail();
    this.createDate = bookInfo.getCreateDate();
    this.updateDate = bookInfo.getUpdateDate();
    this.pageCount = bookInfo.getPageCount();
    this.isFavorite = bookInfo.getIsFavorite();
    this.status = bookInfo.getStatus();
    this.memorandum = bookInfo.getMemorandum();
    this.isVisible = bookInfo.getIsVisible();
    this.completeDate = bookInfo.getCompleteDate();
    this.pageHistories = bookInfo.getPageHistories();
    this.identifiers = bookInfo.getIdentifiers();
    this.shelfCategories = bookInfo.getShelfCategories();
    this.gapiId = bookInfo.getGapiId();
  }

  /**タイトルを取得する(存在しなければ「データ無し」を返す) */
  public getTitleLabel() {
    return this.title ?? 'データ無し';
  }

  /**書誌データの日付を画面表示用の形式に変換する。 */
  public getDateLabel(dateType: 'create' | 'update' | 'complete', useYear = true): string {
    let target: Date | undefined;
    switch (dateType) {
      case 'create':
        target = this.createDate;
        break;
      case 'update':
        target = this.updateDate;
        break;
      case 'complete':
        target = this.completeDate;
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

  public isDisplayableProgress() {
    return (this.pageCount && this.pageCount > 0) && (this.pageHistories && this.pageHistories?.length > 0)
  }

  /**ページ数に対して何ページ読んだかのパーセントを文字列で取得する。*/
  public getProgressByPercent() {
    //小数点を抜いて、パーセントに変換する。
    const ratio = Math.trunc(this.getMaxPageCountFromHistory()! / this.pageCount * 100);
    return `${ratio.toString()}%`;
  }

  /**pageHistoryの中から最大のページ数を取得する。*/
	private getMaxPageCountFromHistory(): number | undefined {
		if (!this.pageHistories?.length) { return undefined; }
		return this.pageHistories?.reduce((max, item) => Math.max(max, item.value.pageCount), -Infinity)!;
	}
}