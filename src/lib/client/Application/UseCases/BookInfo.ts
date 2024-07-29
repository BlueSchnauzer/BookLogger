import type { bookInfoChangeResponse } from '$lib/client/Application/Interface';
import { BookInfoView } from '$lib/client/Application/Views/BookInfo';
import type { BookInfo } from '$lib/client/Domain/Entities/BookInfo';
import type { Id } from '$lib/client/Domain/ValueObjects/BookInfo/Id';
import { getPageHistoryMapInCurrentWeek } from '$lib/client/Utils/PageHistory';
import type { IBookInfoEntityRepository } from '$lib/client/Domain/Repositories/IBookInfoEntity';
import type { books_v1 } from 'googleapis';

/**書誌データの操作を管理するUseCase */
export class BookInfoUseCase {
	constructor(private readonly repos: IBookInfoEntityRepository) {}

	/**登録済みの全書誌データ取得する */
	public async get(): Promise<BookInfoView[]> {
		const bookInfos = await this.repos.get();
		return bookInfos.map((item) => new BookInfoView(item));
	}

	/**読みたい本ステータスの書誌データを取得する */
	public async getWish(): Promise<BookInfoView[]> {
		const bookInfos = await this.repos.getByStatus('wish');
		return bookInfos.map((item) => new BookInfoView(item));
	}

	/**読んでいる本ステータスの書誌データを取得する */
	public async getReading(): Promise<BookInfoView[]> {
		const bookInfos = await this.repos.getByStatus('reading');
		return bookInfos.map((item) => new BookInfoView(item));
	}

	/**読み終わった本ステータスの書誌データを取得する */
	public async getComplete(): Promise<BookInfoView[]> {
		const bookInfos = await this.repos.getByStatus('complete');
		return bookInfos.map((item) => new BookInfoView(item));
	}

	/**直近で読んだ書誌データを取得する */
	public async getRecent(): Promise<BookInfoView | undefined> {
		const bookInfo = await this.repos.getRecent();
		return bookInfo ? new BookInfoView(bookInfo) : undefined;
	}

	/**1週間に読んだページ数を取得する */
	public async getHistory(): Promise<Map<string, number> | undefined> {
		const pageHistory = await this.repos.getPageHistory();
		return getPageHistoryMapInCurrentWeek(pageHistory);
	}

	/**書誌データを保存する */
	public async create(postData: books_v1.Schema$Volumes): Promise<bookInfoChangeResponse> {
		const { ok: isSuccess, status } = await this.repos.insert(postData);
		const message = isSuccess
			? '登録しました'
			: status === 409
				? '登録済みの書籍です'
				: '登録に失敗しました。<br>時間をおいて再度登録してください。';

		return { isSuccess, message };
	}

	/**書誌データを更新する */
	public async update(bookInfo: BookInfo, isComplete: boolean): Promise<bookInfoChangeResponse> {
		const { ok: isSuccess } = await this.repos.update(bookInfo, isComplete);
		const message = isSuccess
			? '更新しました。'
			: '更新に失敗しました。<br>時間をおいてから再度お試しください。';

		return { isSuccess, message };
	}

	/**書誌データを削除する */
	public async delete(id: Id): Promise<bookInfoChangeResponse> {
		const { ok: isSuccess } = await this.repos.delete(id.value);
		const message = isSuccess
			? '削除しました'
			: '削除に失敗しました。<br>時間をおいて再度登録してください。';

		return { isSuccess, message };
	}
}
