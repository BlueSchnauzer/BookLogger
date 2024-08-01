import type { ObjectId } from 'mongodb';
import { UserId } from '$lib/server/Domain/ValueObjects/BookInfo/UserId';
import { Status, type status } from "$lib/server/Domain/ValueObjects/BookInfo/Status";
import { Id } from '$lib/server/Domain/ValueObjects/BookInfo/Id';
import { PageHistory, type pageHistory } from '$lib/server/Domain/ValueObjects/BookInfo/PageHistory';
import { Identifiers, type identifiers } from '$lib/server/Domain/ValueObjects/BookInfo/Identifier';
import type MongoDBModel from '$lib/server/Domain/Entities/MongoDBModel/BookInfo';

/**書誌情報のEntity */
export class BookInfo {
	public readonly id: Id;
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

	/**BookInfoのEntityを生成(MongoDBのモデルを渡して生成する) */
	constructor(properties: bookInfoProperties) {
		this.id = new Id(properties.id);
		this.userId = new UserId(properties.userId);
		this.title = properties.title;
		this.author = properties.author;
		this.thumbnail = properties.thumbnail;
		this.createDate = properties.createDate;
		this.updateDate = properties.updateDate;
		this.pageCount = properties.pageCount;
		this.isFavorite = properties.isFavorite;
		this.status = new Status(properties.status);
		this.memorandum = properties.memorandum;
		this.isVisible = properties.isVisible;
		this.completeDate = properties.completeDate;
		this.pageHistories = properties.pageHistories ? properties.pageHistories?.map(item => new PageHistory(item)) : [];
		this.identifiers = properties.identifiers != undefined ? new Identifiers(properties.identifiers) : undefined;
		this.shelfCategories = properties.shelfCategories;
		this.gapiId = properties.gapiId;
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