import type { id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { pageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { BookInfoDBModel } from '$lib/server/Feature/Contents/MongoDB/BookInfoModel';

/**DBとの書誌データの取得・保存を扱うリポジトリ
 * 返却する値はDBモデルかプリミティブ型(のみを含んだ型)
 * SvelteのAPIルートから呼び出されることを想定しているので、
 * クラス形式のEntityではなく、プレーンオブジェクトのみを返す。
 */
export interface IBookInfoDBRepositories {
	getBookInfo(id: id): Promise<BookInfoDBModel | undefined>;
	getBookInfos(): Promise<BookInfoDBModel[]>;
	getBookInfosByStatus(status: status): Promise<BookInfoDBModel[]>;
	getRecentBookInfo(): Promise<BookInfoDBModel | undefined>;
	getPageHistory(): Promise<Array<pageHistory[]>>;
	insert(bookInfo: BookInfoDBModel): Promise<Response>;
	update(bookInfo: BookInfoDBModel, isCompleteReading: boolean): Promise<Response>;
	delete(id: id): Promise<Response>;
	isDuplicate(keyId: string): Promise<boolean>;
}
