import type { id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { pageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { BookInfoDBModel } from '$lib/server/Domain/Entities/MongoDB/BookInfoModel';

/**DBとの書誌データの取得・保存を扱うリポジトリ
 * 返却する値はDBモデルかプリミティブ型(のみを含んだ型)
 * SvelteのAPIルートから呼び出されることを想定しているので、
 * クラス形式のEntityではなく、プレーンオブジェクトのみを返す。
 */
export interface IBookInfoDBRepositories {
	/**書誌データを取得する */
	get(): Promise<BookInfoDBModel[]>;
	/**statusが引数と一致した書誌データを取得する */
	getByStatus(status: status): Promise<BookInfoDBModel[]>;
	/**直近で読んだ、書誌データを1件取得する */
	getRecent(): Promise<BookInfoDBModel | undefined>;
	/**書誌データから、pageHistoryのみを取得する */
	getPageHistory(): Promise<Array<pageHistory[]>>;
	/**書誌データを保存する */
	insert(bookInfo: BookInfoDBModel): Promise<Response>;
	/**書誌データを更新する */
	update(bookInfo: BookInfoDBModel, isCompleteReading: boolean): Promise<Response>;
	/**書誌データを削除する */
	delete(id: id): Promise<Response>;
	/**同様の書誌データが既に保存されているか */
	isDuplicate(keyId: string): Promise<boolean>;
}
