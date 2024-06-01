import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status, type status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { Id } from '$lib/server/Domain/ValueObjects/BookInfo/Id';
import { PageHistory, type pageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers, type identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import type MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';
import type { books_v1 } from 'googleapis';

/**書誌情報のEntity */
export class BookInfo {
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

	constructor(volume: books_v1.Schema$Volume, userId: string);
	constructor(properties: bookInfoProperties);

	/**BookInfoのEntityを生成(MongoDBのモデルを渡して生成する) */
	constructor(resource: bookInfoProperties | books_v1.Schema$Volume, userId?: string) {
		if (isBookInfoProperties(resource)){
			this.id = new Id(resource.id);
			this.userId = new UserId(resource.userId);
			this.title = resource.title;
			this.author = resource.author;
			this.thumbnail = resource.thumbnail;
			this.createDate = resource.createDate;
			this.updateDate = resource.updateDate;
			this.pageCount = resource.pageCount;
			this.isFavorite = resource.isFavorite;
			this.status = new Status(resource.status);
			this.memorandum = resource.memorandum;
			this.isVisible = resource.isVisible;
			this.completeDate = resource.completeDate;
			this.pageHistories = resource.pageHistories ? resource.pageHistories?.map(item => new PageHistory(item)) : [];
			this.identifiers = resource.identifiers != undefined ? new Identifiers(resource.identifiers) : undefined;
			this.shelfCategories = resource.shelfCategories;
			this.gapiId = resource.gapiId;
		}
		else {
			const currentDate = new Date;

			this.userId = new UserId(userId!);
			this.title = resource!.volumeInfo?.title ?? '';
			this.author = resource!.volumeInfo?.authors ?? [''];
			this.thumbnail = resource!.volumeInfo?.imageLinks?.thumbnail ?? ''; //gapi固有の情報だが、画像そのものではなく場所を表すURLを保存する。
			this.createDate = currentDate;
			this.updateDate = currentDate;
			this.pageCount = resource!.volumeInfo?.pageCount ?? 0;
			this.isFavorite = false;
			this.status = new Status('wish');
			this.memorandum = '';
			this.isVisible = true;
			this.identifiers = new Identifiers(getIdentifier(resource!.volumeInfo?.industryIdentifiers)!);
			this.gapiId = resource!.id ?? this.title; //gapi固有の情報なので入れたら微妙な感じではある
		}
	}

	/**MongoDBModelからEntityを生成する */
	public static fromDBModel(mongoModel: MongoDBModel) {
		return new BookInfo({
			id: mongoModel._id?.toString()!,
			userId: mongoModel.userId,
			title: mongoModel.title,
			author: mongoModel.author,
			thumbnail: mongoModel.thumbnail,
			createDate: mongoModel.createDate,
			updateDate: mongoModel.updateDate,
			pageCount: mongoModel.pageCount,
			isFavorite: mongoModel.isFavorite,
			status: mongoModel.status,
			memorandum: mongoModel.memorandum,
			isVisible: mongoModel.isVisible,
			completeDate: mongoModel.completeDate,
			pageHistories: mongoModel.pageHistories,
			identifiers: mongoModel.identifiers,
			shelfCategories: mongoModel.shelfCategories,
			gapiId: mongoModel.gapiId
		}
		);
	}

	/**編集可能なValueObjectを更新する */
	public update(pageCount: number, isFavorite: boolean, status: status, memorandum: string, pageHistories: pageHistory[],): void {
		try {

		}
		catch (error) {
			console.log(error);
			throw error;
		}
	}

	/**最終ページのpageHistoryがあるかを確認する。 */
	public hasCompleteHistory(): boolean {
		if (!this.pageHistories?.length) { return false; }

		let result = false;
		this.pageHistories!.forEach(item => {
			if (item.value.pageCount === this.pageCount) { result = true; }
		})

		return result;
	}
	
  /**pageHistoryの中から最大のページ数を取得する。*/
	public getMaxPageCount(): number {
		return this.pageHistories!.reduce((max, item) => Math.max(max, item.value.pageCount), -Infinity)!;
	}
}

/**書誌情報のEntityを生成するためのプロパティ */
export type bookInfoProperties = {
	id: string,
	userId: string,
	title: string,
	author: string[],
	thumbnail: string,
	createDate: Date,
	updateDate: Date,
	pageCount: number,
	isFavorite: boolean,
	status: status,
	memorandum: string,
	isVisible: boolean,
	completeDate?: Date,
	pageHistories?: pageHistory[],
	identifiers?: identifiers,
	shelfCategories?: ObjectId[],
	gapiId?: string
}

const isBookInfoProperties = (obj: any): obj is bookInfoProperties => {
	return 'userId' in obj;
}

type industryIdentifiers = {
	identifier?: string | undefined;
	type?: string | undefined;
} [] | undefined

/**ISBNを取得する(存在しない場合はundefined) */
const getIdentifier = (identifiers: industryIdentifiers) => {
	const isbn_13 = identifiers?.find(id => id.type === 'ISBN_13')?.identifier;
	if (isbn_13) { return {isbn_13}; }
	
	const isbn_10 = identifiers?.find(id => id.type === 'ISBN_10')?.identifier;
	if (isbn_10) { return {isbn_10}; }

	return undefined;
}