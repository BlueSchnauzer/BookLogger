import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import type { PageHistory } from '$lib/client/Domain/ValueObjects/BookInfo/PageHistory';
import type { status } from '$lib/client/Domain/ValueObjects/BookInfo/Status';
import type { books_v1 } from 'googleapis';

/**書誌データのEntityの取得や更新を扱うリポジトリ
 * 返却する値はEntityもしくはValueObject
 * UseCaseから呼び出され、APIルートからの戻り値をEntityに変換して返す。
 */
export interface IBookInfoEntityRepository {
	/**書誌データを取得する */
	get(): Promise<BookInfo[]>;
	/**statusが引数と一致した書誌データを取得する */
	getByStatus(status: status): Promise<BookInfo[]>;
	/**直近で読んだ、書誌データを1件取得する */
	getRecent(): Promise<BookInfo | undefined>;
	/**書誌データから、pageHistoryのみを取得する */
	getPageHistory(): Promise<Array<PageHistory[]>>;
	/**書誌データを保存する */
	insert(item: books_v1.Schema$Volume): Promise<Response>;
	/**書誌データを更新する */
	update(bookInfo: BookInfo, isCompleteReading: boolean): Promise<Response>;
	/**書誌データを削除する */
	delete(id: id): Promise<Response>;
}
